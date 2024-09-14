const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/finditem");

const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL } = require("../secret");
const { sendEmailWithNodeMailer } = require("../helper/email");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip(limit * (page - 1)); // pagination;

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0)
      throw next(createError(404, "No Users found!"));

    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned succesfully!",
      payload: {
        users,
        pagination: {
          totalpages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User were returned succesfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User were deleted succesfully!",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const userExist = await User.exists({ email: email });
    if (userExist) {
      throw createError(409, "User already exists!Please login.");
    }

    //print user data
    console.log("User Data: ", { name, email, password, phone, address });

    //create jwt
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    //prepare email
    const emailData = {
      email,
      subject: "Account Activation Link",
      html: `
        <h2>Hello ${name} ! </h2>
        <h1>Please use the following link to activate your account</h1>
        <a href="${clientURL}/api/users/activate/${token}" target="_blank">
        <hr />
        <p>This email may contain sensitive information</p>
      `,
    };

    //send email with nodemailer
    try {
      await sendEmailWithNodeMailer(emailData);
    } catch (emailError) {
      next(createError(500, "Email could not be sent!"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please check your ${email} for activation link!`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      throw createError(404, "Invalid token! Please try again.");
    }

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) {
        throw createError(401, "Unable to verfy user! Please try again.");
      }
      const userExist = await User.exists({ email: decoded.email });
      if (userExist) {
        throw createError(409, "User already exists!Please login.");
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: `User account activated successfully!`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token expired! Please try again.");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid token! Please try again.");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};

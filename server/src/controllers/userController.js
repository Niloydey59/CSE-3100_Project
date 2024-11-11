const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/finditem");

const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL, jswtResetPassKey } = require("../secret");
const { sendEmailWithNodeMailer } = require("../helper/email");
const { runValidation } = require("../validators/validation");

const getUsers = async (req, res, next) => {
  try {
    //pagination and search query params
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    //search filter and options for query
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [
        { username: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    //find users with filter and options
    const users = await User.find(filter, options)
      .limit(limit)
      .skip(limit * (page - 1)); // pagination;

    //count total users
    const count = await User.find(filter).countDocuments();

    //return error if no users found
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
    //get user id from request params
    const id = req.params.id;
    const options = { password: 0 };

    //find user with id and exclude password field(options object)
    const user = await findWithId(User, id, options);

    console.log("User: ", user);

    // find user and delete
    await User.findByIdAndDelete({
      _id: id,
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
    //get user data from request body
    const { username, email, password } = req.body;

    //check if user already exists
    const userExist = await User.exists({ email: email });
    if (userExist) {
      throw createError(409, "User already exists!Please login.");
    }

    //print user data
    console.log("User Data: ", { username, email, password });

    //create jwt
    const token = createJSONWebToken(
      { username, email, password },
      jwtActivationKey,
      "10m"
    );

    //prepare email
    const emailData = {
      email,
      subject: "Account Activation Link",
      html: `
        <h2>Hello ${username} ! </h2>
        <h1>Please use the following link to activate your account</h1>
        <a href="${clientURL}/api/users/verify/${token}" target="_blank">
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
    //get token from request body
    const token = req.body.token;

    //check if token exists
    if (!token) {
      throw createError(404, "Invalid token! Please try again.");
    }

    try {
      //verify token with jwt key and get decoded data
      const decoded = jwt.verify(token, jwtActivationKey);
      console.log("Decoded: ", decoded);

      //check if decoded data exists
      if (!decoded) {
        throw createError(401, "Unable to verfy user! Please try again.");
      }

      //check if user already exists
      const userExist = await User.exists({ email: decoded.email });
      if (userExist) {
        throw createError(409, "User already exists!Please login.");
      }

      //create user with decoded data
      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: `User account registered successfully!`,
      });
    } catch (error) {
      //check if token expired or invalid
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

const updateUserById = async (req, res, next) => {
  try {
    //get user id from request params
    const userid = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userid, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    for (let key in req.body) {
      if (["username", "password"].includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) throw createError(404, "User not found!");

    return successResponse(res, {
      statusCode: 200,
      message: "User were updated succesfully!",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    // get user password from request body
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;

    const user = await findWithId(User, userId);

    //compare password
    const isPasswordmatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordmatch) {
      throw createError(400, "Old password did not match! Please try again.");
    }

    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) throw createError(400, "Password not updated!");

    return successResponse(res, {
      statusCode: 200,
      message: "User password were updated succesfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    // get user email from request body
    const { email } = req.body;

    // check if user exists
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      throw createError(404, "User does not exist! Please register.");
    }
    //console.log("User Data: ", userExist);

    //create jwt
    const token = createJSONWebToken({ email }, jswtResetPassKey, "10m");

    //prepare email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
        <h2>Hello ${userExist.name} ! </h2>
        <h1>Please use the following link to reset your password </h1>
        <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">
        <hr />
        <p>Reset Your Password</p>
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
      message: "Please check your email for password reset link!",
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    const decoded = jwt.verify(token, jswtResetPassKey);
    if (!decoded) {
      throw createError(401, "Token is invalid or expired! Please try again.");
    }

    const filter = { email: decoded.email };
    const update = { password: newPassword };
    const options = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      filter,
      update,
      options
    ).select("-password");

    if (!updatedUser) throw createError(400, "Password reset failed!");

    return successResponse(res, {
      statusCode: 201,
      message: `Password reset successfully!`,
      payload: { updatedUser },
    });
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
  updateUserById,
  updatePassword,
  forgetPassword,
  resetPassword,
};

const createError = require("http-errors"); // error-handling middleware
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const cloudinary = require("../config/cloudinary");

const userLogin = async (req, res, next) => {
  try {
    //email and password from request body
    const { email, password } = req.body;

    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found! Please register.");
    }

    //compare password
    const isPasswordmatch = await bcrypt.compare(password, user.password);
    if (!isPasswordmatch) {
      throw createError(400, "Invalid credentials! Please try again.");
    }

    //isBanned
    //generate token, cookie
    //create jwt
    const accesstoken = createJSONWebToken({ user }, jwtAccessKey, "15m");
    const refreshtoken = createJSONWebToken({ user }, jwtRefreshKey, "7d");

    res.cookie("access_token", accesstoken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.cookie("refresh_token", refreshtoken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "Users logged in succesfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    //clear cookie
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "Users logged out succesfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    //get user from request
    const user = req.user;
    //remove password from user
    user.password = undefined;

    return successResponse(res, {
      statusCode: 200,
      message: "Current user fetched successfully!",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const requestVerification = async (req, res, next) => {
  try {
    const images = req.files;

    const { series, position, department } = req.body;
    if (!series && !position && !department) {
      throw createError(
        400,
        "At least one field is required  for verification"
      );
    }

    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    const fieldsToVerify = [];

    if (series) {
      const seriesYear = parseInt(series);
      if (isNaN(seriesYear)) {
        throw createError(400, "Invalid series year");
      }
      user.series.value = seriesYear;
      user.series.pendingApproval = true;
      user.series.isApproved = false;
      fieldsToVerify.push("series");
    }

    if (position) {
      const validPositions = user.schema.path("position.value").enumValues;
      if (!validPositions.includes(position)) {
        throw createError(400, "Invalid position");
      }
      user.position = {
        value: position,
        pendingApproval: true,
        isApproved: false,
      };
      fieldsToVerify.push("position");
    }

    if (department) {
      const validDepartments = user.schema.path("department.value").enumValues;
      if (!validDepartments.includes(department)) {
        throw createError(400, "Invalid department");
      }
      user.department = {
        value: department,
        pendingApproval: true,
        isApproved: false,
      };
      fieldsToVerify.push("department");
    }

    const imageUrls = [];
    // Upload verification document
    for (const image of images) {
      const response = await cloudinary.uploader.upload(image.path, {
        folder: "StackRuet/verification",
      });
      imageUrls.push(response.secure_url);
    }
    // save img urls with the previos data
    user.verificationDocument = user.verificationDocument.concat(imageUrls);

    if (user.verificationDocument.length == 0) {
      throw createError(400, "At least one verification document is required");
    }
    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Verification request submitted successfully",
      payload: {
        pendingVerifications: fieldsToVerify,
      },
    });
  } catch (error) {
    next(error);
  }
};

const approveVerification = async (req, res, next) => {
  try {
    const { userId, field, status } = req.body;
    if (!userId || !field) {
      throw createError(400, "User ID and field are required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (status === "approve") {
      user[field].isApproved = true;
      user[field].pendingApproval = false;
    } else if (status === "reject") {
      user[field].isApproved = false;
      user[field].pendingApproval = false;
    } else {
      throw createError(400, "Invalid status");
    }

    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: `Verification ${status}ed successfully`,
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userLogin,
  userLogout,
  getCurrentUser,
  requestVerification,
  approveVerification,
};

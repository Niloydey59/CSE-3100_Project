const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey } = require("../secret");

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
    const accesstoken = createJSONWebToken({ email }, jwtAccessKey, "10m");
    res.cookie("access_token", accesstoken, {
      maxAge: 15 * 60 * 1000, // 15 minutes
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

module.exports = { userLogin, userLogout };

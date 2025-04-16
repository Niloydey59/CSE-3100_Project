const createError = require("http-errors"); // error-handling middleware
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const cloudinary = require("../config/cloudinary");

const userLogin = async (req, res, next) => {
  try {
    //email and password from request body
    const { email, password } = req.body;

    console.log("Email: ", email);
    console.log("Password: ", password);

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

    // Create user object without sensitive data for token
    const userForToken = {
      _id: user._id,
      email: user.email,
      username: user.username,
      bio: user.bio,
      series: user.series,
      position: user.position,
      department: user.department,
      verificationDocument: user.verificationDocument,
      groups: user.groups,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    };
    //generate token, cookie
    //create jwt
    const accessToken = createJSONWebToken(
      { user: userForToken },
      jwtAccessKey,
      "15m"
    );
    const refreshToken = createJSONWebToken(
      { user: userForToken },
      jwtRefreshKey,
      "7d"
    );

    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    //success response
    return successResponse(res, {
      statusCode: 200,
      message: "Users logged in succesfully!",
      payload: {
        user: userForToken,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    //clear cookie
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

const refreshAccessToken = async (req, res, next) => {
  try {
    console.log("Refreshing access token...");
    //console.log("Request Body: ", req.body);
    // Get refresh token from cookie
    //console.log("Request Cookies: ", req.cookies);
    const refreshToken = req.cookies.refresh_token;
    //console.log("Refresh Token: ", refreshToken);

    if (!refreshToken) {
      throw createError(401, "Refresh token not found");
    }

    // Verify refresh token
    try {
      const decoded = jwt.verify(refreshToken, jwtRefreshKey);
      const userFromToken = decoded.user;

      // Generate new access token
      const newAccessToken = createJSONWebToken(
        { user: userFromToken },
        jwtAccessKey,
        "15m"
      );

      // Return new access token
      return successResponse(res, {
        statusCode: 200,
        message: "New access token generated successfully",
        payload: {
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      console.error("Error verifying refresh token:", error);
      throw createError(401, "Invalid or expired refresh token");
    }
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    //get user from request
    const userid = req.user._id;
    //find user by id
    const user = await User.findById(userid);

    if (!user) {
      throw createError(404, "User not found");
    }

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
    console.log(req.files);
    // Check if files exist
    const images = req.files || [];

    if (images.length === 0) {
      throw createError(400, "At least one verification document is required");
    }

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
    if (!userId || !field || !status) {
      throw createError(400, "User ID and field and status are required");
    }

    if (!["approve", "reject"].includes(status)) {
      throw createError(400, "Status must be either 'approve' or 'reject'");
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
  refreshAccessToken,
  getCurrentUser,
  requestVerification,
  approveVerification,
};

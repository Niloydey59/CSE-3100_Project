const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const User = require("../models/userModel"); // Add User model import

const isLoggedIn = async (req, res, next) => {
  try {
    // Get refresh token from cookies
    const refreshToken = req.cookies.refresh_token;

    // Try to get access token from Authorization header
    const authHeader = req.headers.authorization;
    let accessToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    }

    // If no tokens at all, user is not authenticated
    if (!accessToken && !refreshToken) {
      throw createError(401, "Authentication required");
    }

    // If we have an access token, try to use it
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        // Fetch user data from database
        const user = await User.findById(decoded.userId);
        if (!user) {
          throw createError(401, "User not found");
        }
        req.user = user;
        console.log("Access token verified");
        return next();
      } catch (error) {
        // If token expired but we have refresh token, don't fail yet
        if (error.name !== "TokenExpiredError" || !refreshToken) {
          throw createError(401, "Invalid access token");
        }
        // Continue to refresh token logic if expired
      }
    }

    // At this point either:
    // 1. No access token but we have refresh token
    // 2. Access token was expired but we have refresh token
    if (refreshToken) {
      return handleTokenRefresh(refreshToken, req, res, next);
    }

    // Should never reach here due to earlier checks
    throw createError(401, "Authentication failed");
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    console.log("User not logged in");
    return next(); // No token, proceed to the next middleware
  }

  return next(createError(400, "User already logged in!"));
};

const isAdmin = (req, res, next) => {
  try {
    //console.log("User Data: ", req.user);
    if (!req.user.isAdmin) {
      throw createError(403, "Access Denied! Admin only.");
    }
    next();
  } catch (error) {
    return next(error);
  }
};

const handleTokenRefresh = async (refreshToken, req, res, next) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtRefreshKey);

    // Fetch the user from the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError(401, "User not found");
    }

    // Generate a new access token
    const accessToken = createJSONWebToken(
      { userId: user._id },
      jwtAccessKey,
      "15m"
    );

    // Set the new token in response header
    res.set("x-access-token", accessToken);

    // Set user in request
    req.user = user;
    console.log("Access token refreshed using refresh token");

    // Proceed to the next middleware
    next();
  } catch (error) {
    // If refresh token is invalid or expired
    throw createError(401, "Invalid refresh token. Please login again.");
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };

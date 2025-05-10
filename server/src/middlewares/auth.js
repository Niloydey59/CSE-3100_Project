const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    //console.log("Auth Header: ", authHeader);

    // Get refresh token from cookies
    const refreshToken = req.cookies.refresh_token;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // No access token, check if refresh token exists
      if (!refreshToken) {
        throw createError(
          401,
          "No access token provided and no refresh token found"
        );
      }

      // Try to refresh using the refresh token
      return handleTokenRefresh(refreshToken, req, res, next);
    }

    // Extract token from header
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      // No access token, check if refresh token exists
      if (!refreshToken) {
        throw createError(
          401,
          "Invalid access token format and no refresh token found"
        );
      }

      // Try to refresh using the refresh token
      return handleTokenRefresh(refreshToken, req, res, next);
    }

    try {
      // Try to verify the access token
      const decoded = jwt.verify(accessToken, jwtAccessKey);

      // Set user in request
      req.user = decoded.user;
      console.log("Access token verified and user set in request");
      //console.log("User Data: ", req.user);

      // Proceed to the next middleware
      next();
    } catch (error) {
      // If token expired and refresh token exists, try to refresh
      if (error.name === "TokenExpiredError" && refreshToken) {
        return handleTokenRefresh(refreshToken, req, res, next);
      }

      // For other JWT errors, throw appropriate error
      throw createError(401, "Invalid or expired access token");
    }
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

const handleTokenRefresh = (refreshToken, req, res, next) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, jwtRefreshKey);

    // Generate a new access token
    const userData = decoded.user;
    const accessToken = jwt.sign({ user: userData }, jwtAccessKey, {
      expiresIn: "15m", // Set appropriate expiration time
    });

    // Set the new token in response header
    res.set("x-access-token", accessToken);

    // Set user in request
    req.user = userData;
    console.log("Access token refreshed using refresh token");

    // Proceed to the next middleware
    next();
  } catch (error) {
    // If refresh token is invalid or expired
    throw createError(401, "Invalid refresh token. Please login again.");
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };

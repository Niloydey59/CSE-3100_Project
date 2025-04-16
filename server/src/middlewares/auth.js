const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    //console.log("Auth Header: ", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "No access token provided");
    }

    // Extract token from header
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw createError(401, "Invalid access token format");
    }

    console.log("User is logged in and found token");
    //console.log("Access Token: ", accessToken);
    // Verify the access token
    const decoded = jwt.verify(accessToken, jwtAccessKey);

    // Set user in request
    req.user = decoded.user;
    console.log("Access token verified and user set in request");
    //console.log("User Data: ", req.user);

    // Proceed to the next middleware
    next();
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

module.exports = { isLoggedIn, isLoggedOut, isAdmin };

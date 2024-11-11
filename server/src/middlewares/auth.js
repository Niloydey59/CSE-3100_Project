const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw createError(401, "Acess Denied! Please login.");
    }
    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Unauthorized! Please login.");
    }
    //console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (error) {
    return next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return next(); // No token, proceed to the next middleware
  }

  const decoded = jwt.verify(token, jwtAccessKey);
  if (decoded) {
    return next(createError(400, "User already logged in!"));
  }

  return next();
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

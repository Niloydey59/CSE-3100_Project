const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { refreshTokenHandler } = require("../services/finditem");

const isLoggedIn = async (req, res, next) => {
  try {
    console.log("Cookies: ", req.cookies);
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken && !refreshToken) {
      throw createError(401, "Acess Denied! Please login.");
    }
    if (!accessToken || req.cookies.access_token === "null") {
      console.log("Calling refreshTokenHandler");

      const newAccessToken = await refreshTokenHandler(refreshToken);
      console.log("New Access Token: ", newAccessToken);
      res.cookie("access_token", newAccessToken, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      const decoded = jwt.verify(newAccessToken, jwtAccessKey);
      req.user = decoded.user;
      next();
    } else {
      const decoded = jwt.verify(accessToken, jwtAccessKey);
      console.log("Decoded: ", decoded);
      req.user = decoded.user;
      return next();
    }
  } catch (error) {
    next(error);
  }
};

const isLoggedOut = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  const refreshToken = req.cookies.refresh_token;

  if (!accessToken && !refreshToken) {
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

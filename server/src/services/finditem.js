const createError = require("http-errors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { jwtRefreshKey, jwtAccessKey } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonwebtoken");

const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);

    if (!item) {
      throw createError(404, `${Model.modelName} not found with this id!`);
    }

    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid item Id!");
    }
    throw error;
  }
};

const refreshTokenHandler = async (refreshToken) => {
  console.log("Access token expired. Trying to refresh token...");
  if (!refreshToken) {
    throw createError(401, "Unauthorized! Please login.");
  }
  // Debugging statement to check the type and value of refreshToken
  console.log("Type of refreshToken:", typeof refreshToken);
  console.log("Value of refreshToken:", refreshToken);

  const decoded = jwt.verify(refreshToken, jwtRefreshKey);
  if (!decoded) {
    throw createError(401, "Unauthorized! Please login.");
  }

  const newAccessToken = createJSONWebToken(
    { user: decoded.user },
    jwtAccessKey,
    "15m"
  );
  console.log("New Access Token: ", newAccessToken);
  return newAccessToken;
};

module.exports = { findWithId, refreshTokenHandler };

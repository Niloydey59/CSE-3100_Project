const createError = require("http-errors"); // error-handling middleware
const jwt = require("jsonwebtoken");

const { successResponse } = require("./responseController");
const { jwtAccessKey } = require("../secret");

const decodeToken = async (req, res, next) => {
  try {
    if (!req.body) {
      throw createError(400, "Token is required");
    }
    const token = req.body.token;
    const decoded = jwt.verify(token, jwtAccessKey);

    if (!decoded) {
      throw createError(400, "Invalid token");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Token decoded successfully",
      payload: { decoded },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { decodeToken };

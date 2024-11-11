const jwt = require("jsonwebtoken");
const logger = require("../controllers/loggerController");

const createJSONWebToken = (payload, secretKey, expiresIn) => {
  // Validate payload and secret key
  if (typeof payload !== "object" || !payload) {
    throw new Error("Payload must be a non-empty object");
  }
  if (typeof secretKey !== "string" || secretKey == "") {
    throw new Error("Secret key must be a non-empty string");
  }

  try {
    // Create JSON Web Token with payload and secret key
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    logger.log("error", "Failed to create JSON Web Token", error);
    throw error;
  }
};

module.exports = { createJSONWebToken };

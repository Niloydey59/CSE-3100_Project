require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;

const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/ecommerceWebsite";

const defaultUserImage =
  process.env.DEFAULT_USER_IMAGE ||
  "server/public/images/users/userDefault.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "ajdnaiudbauibh894";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  mongodbURL,
  defaultUserImage,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientURL,
};

require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;

const mongodbURL =
  process.env.MONGODB_ATLAS_URL || "mongodb://localhost:27017/StackRuet";

const defaultUserImage =
  process.env.DEFAULT_USER_IMAGE || "public/images/users/userDefault.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "ajdnaiudbauibh894";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "ajdnaiudbauibh894";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL || "";

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || "";
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET || "";

module.exports = {
  serverPort,
  mongodbURL,
  defaultUserImage,
  jwtActivationKey,
  jwtAccessKey,
  smtpUsername,
  smtpPassword,
  clientURL,
  cloudinaryCloudName,
  cloudinaryApiKey,
  cloudinaryApiSecret,
};

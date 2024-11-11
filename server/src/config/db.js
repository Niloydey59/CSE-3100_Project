const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDataBase = async (options = {}) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongodbURL, options);
    logger.log("info", "MongoDB connected");

    // Log unsuccessful connection
    mongoose.connection.on("error", (error) => {
      logger.log("error", "DB connection error: ", error);
    });
  } catch (error) {
    // Log unsuccessful connection
    logger.log("error", "Could not connect to DB: ", error.toString());
  }
};

module.exports = connectDataBase;

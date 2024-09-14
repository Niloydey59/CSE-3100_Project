const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDataBase = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    logger.log("info", "MongoDB connected");

    mongoose.connection.on("error", (error) => {
      logger.log("error", "DB connection error: ", error);
    });
  } catch (error) {
    logger.log("error", "Could not connect to DB: ", error.toString());
  }
};

module.exports = connectDataBase;

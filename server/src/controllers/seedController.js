const data = require("../data");
const User = require("../models/userModel");
const seedUsers = async (req, res, next) => {
  try {
    // Delete all users
    await User.deleteMany({});

    // Create new users
    const users = await User.insertMany(data.users);

    // Success response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUsers };

const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const { validateUserRegistration } = require("../validators/user");
const { runValidation } = require("../validators/validation");

const userRouter = express.Router();

// /api/users common path
userRouter.post(
  "/process-register",
  validateUserRegistration,
  runValidation,
  processRegister
); // Register user
userRouter.post("/verify", activateUserAccount); // Activate user account
userRouter.get("/", getUsers); // Get all users
userRouter.get("/:id", getUserById); // Get user by id
userRouter.delete("/:id", deleteUserById); // Delete user by id
userRouter.put("/:id", updateUserById); // Update user by id

module.exports = userRouter;

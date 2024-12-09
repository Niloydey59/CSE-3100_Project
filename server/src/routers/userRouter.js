const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  resetPassword,
  updatePassword,
  forgetPassword,
  sendActivationEmail,
} = require("../controllers/userController");
const upload = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateResetPassword,
  validateUpdatePassword,
  validateForgetPassword,
} = require("../validators/user");
const { runValidation } = require("../validators/validation");
const { isLoggedOut, isLoggedIn, isAdmin } = require("../middlewares/auth");

const userRouter = express.Router();

// /api/users common path
userRouter.post(
  "/process-register",
  isLoggedOut,
  validateUserRegistration,
  runValidation,
  processRegister
); // Register user

userRouter.post("/send-verification-email", isLoggedIn, sendActivationEmail); // Send activation email

userRouter.post("/verify", isLoggedIn, activateUserAccount); // Activate user account

userRouter.get("/", getUsers); // Get all users

userRouter.get("/:id", getUserById); // Get user by id

userRouter.delete("/:id", isLoggedIn, deleteUserById); // Delete user by id

userRouter.put(
  "/reset-password",
  validateResetPassword,
  runValidation,
  resetPassword
); // reset password

userRouter.put("/:id", isLoggedIn, updateUserById); // Update user by id

userRouter.put(
  "/update-password/:id",
  validateUpdatePassword,
  runValidation,
  isLoggedIn,
  updatePassword
); // Update user password

userRouter.post(
  "/forget-password",
  validateForgetPassword,
  runValidation,
  forgetPassword
); // forget password

module.exports = userRouter;

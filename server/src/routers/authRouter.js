const express = require("express");

const {
  userLogin,
  userLogout,
  getCurrentUser,
  requestVerification,
  approveVerification,
  refreshAccessToken,
} = require("../controllers/authController");

const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { uploadVerificationImage } = require("../middlewares/uploadFile");

const authRouter = express.Router();

authRouter.post("/login", isLoggedOut, userLogin);
authRouter.get("/logout", isLoggedIn, userLogout);
authRouter.post("/refresh-token", refreshAccessToken);

authRouter.get("/current-user", isLoggedIn, getCurrentUser);

authRouter.post(
  "/users/verify/:id",
  uploadVerificationImage.array("verificationProof", 5),
  isLoggedIn,
  requestVerification
); // Request verification

authRouter.post(
  "/users/approve-verification",
  isLoggedIn,
  isAdmin,
  approveVerification
); // Approve verification

module.exports = authRouter;

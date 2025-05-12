const express = require("express");

const {
  userLogin,
  userLogout,
  getCurrentUser,
  requestVerification,
  uploadVerificationDocuments,
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

// Split into two separate routes
authRouter.post("/users/verify", isLoggedIn, requestVerification); // Request verification for fields

authRouter.post(
  "/users/upload-documents",
  uploadVerificationImage.array("verificationProof", 5),
  isLoggedIn,
  uploadVerificationDocuments
); // Upload verification documents

authRouter.post(
  "/users/approve-verification",
  isLoggedIn,
  isAdmin,
  approveVerification
); // Approve verification

module.exports = authRouter;

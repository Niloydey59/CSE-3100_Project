const express = require("express");
const adminRouter = express.Router();
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const {
  getVerificationRequests,
  handleVerification,
} = require("../controllers/adminController");

// Admin routes
adminRouter.get(
  "/verification-requests",
  isLoggedIn,
  isAdmin,
  getVerificationRequests
);
adminRouter.post(
  "/handle-verification",
  isLoggedIn,
  isAdmin,
  handleVerification
);

module.exports = adminRouter;

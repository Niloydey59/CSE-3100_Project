const express = require("express");

const {
  userLogin,
  userLogout,
  getCurrentUser,
} = require("../controllers/authController");

const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/login", isLoggedOut, userLogin);
authRouter.get("/logout", isLoggedIn, userLogout);
authRouter.get("/current-user", isLoggedIn, getCurrentUser);

module.exports = authRouter;

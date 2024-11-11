const express = require("express");
const { userLogin, userLogout } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/login", userLogin);
authRouter.post("/logout", userLogout);

module.exports = authRouter;

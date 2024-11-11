const express = require("express");
const { runValidation } = require("../validators/validation");
const {
  getPosts,
  getPostById,
  updatePostById,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/auth");

const postRouter = express.Router();

// /api/posts common path
postRouter.get("/", getPosts); // Get all users

postRouter.get("/:id", getPostById); // Get post by ID

postRouter.put("/:id", isLoggedIn, updatePostById); // Update post by ID

module.exports = postRouter;

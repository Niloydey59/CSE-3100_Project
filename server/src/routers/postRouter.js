const express = require("express");

const { runValidation } = require("../validators/validation");
const {
  getPosts,
  getPostById,
  updatePostById,
  likePostById,
  dislikePostById,
  createPost,
  getPostsByUserId,
  deletePostById,
} = require("../controllers/postController");
const { isLoggedIn } = require("../middlewares/auth");

const { uploadPostImage } = require("../middlewares/uploadFile");

const postRouter = express.Router();

// /api/posts common path

postRouter.post(
  "/",
  uploadPostImage.array("image", 10),
  isLoggedIn,
  createPost
); // Create new post

postRouter.get("/", getPosts); // Get all posts

postRouter.get("/user", isLoggedIn, getPostsByUserId); // Get posts by user ID

postRouter.get("/:id", getPostById); // Get post by ID

postRouter.put("/:id", isLoggedIn, updatePostById); // Update post by ID

postRouter.delete("/:id", isLoggedIn, deletePostById); // Delete post by ID

postRouter.post("/like/:id", isLoggedIn, likePostById); // Like post by ID

postRouter.post("/dislike/:id", isLoggedIn, dislikePostById); // Dislike post by ID

module.exports = postRouter;

const express = require("express");

const { isLoggedIn, isLoggedOut } = require("../middlewares/auth");
const {
  addComment,
  getComments,
  updateCommentById,
  deleteCommentById,
  likeCommentById,
  dislikeCommentById,
} = require("../controllers/commentController");

const commentRouter = express.Router();

// api/comments
commentRouter.post("/add-comment/:postId", isLoggedIn, addComment);
commentRouter.get("/:postId", getComments);
commentRouter.put("/:id", isLoggedIn, updateCommentById);
commentRouter.delete("/:id", isLoggedIn, deleteCommentById);
commentRouter.post("/like/:id", isLoggedIn, likeCommentById);
commentRouter.post("/dislike/:id", isLoggedIn, dislikeCommentById);

module.exports = commentRouter;

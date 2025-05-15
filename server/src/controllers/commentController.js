const createError = require("http-errors"); // error-handling middleware

const { successResponse } = require("./responseController");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { findWithId } = require("../services/finditem");
const cloudinary = require("../config/cloudinary");
const { publicIDfromURL } = require("../helper/cloudinaryHelper");
const Comment = require("../models/commentModel");

const addComment = async (req, res, next) => {
  try {
    console.log("Request Body: ", req.body);
    const { content } = req.body;
    const { postId } = req.params;

    const user = req.user;

    //print post data
    console.log("Comment Data: ", {
      content,
      author: user,
      postId,
    });

    //create product
    const comment = await Comment.create({
      content,
      author: user,
      postId: postId,
    });

    // add comment id in the post comments array
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    return successResponse(res, {
      statusCode: 200,
      message: `Comment created successfully`,
      payload: comment,
    });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    //pagination and search query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    //search filter and options for query
    const filter = { postId };
    const options = {};

    //find comments with filter and options
    const comments = await Comment.find(filter, options)
      .populate("author", "username") // populate author field with username
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean();

    //count total comments
    const count = await Comment.find(filter).countDocuments();

    return successResponse(res, {
      statusCode: 200,
      message:
        comments.length > 0
          ? "Comments were returned successfully!"
          : "No comments found for this post.",
      payload: {
        comments,
        pagination: {
          totalpages: Math.ceil(count / limit) || 1,
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateCommentById = async (req, res, next) => {
  try {
    //get post id from request params
    const id = req.params.id;
    const options = {};
    await findWithId(Comment, id, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    for (let key in req.body) {
      if (["content"].includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      updates,
      updateOptions
    );

    if (!updatedComment) throw createError(404, "Comment not found!");

    return successResponse(res, {
      statusCode: 200,
      message: "Comment was updated succesfully!",
      payload: { updatedComment },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCommentById = async (req, res, next) => {
  try {
    // Get product by id
    const { id } = req.params;

    // Find product from database by id
    const postExists = await Post.findById(id);

    // Check if product exists
    if (!postExists) {
      throw createError(404, "Product not found!");
    }

    // Delete product images from Cloudinary
    if (postExists.image.length > 0) {
      for (const image of postExists.image) {
        const publicID = await publicIDfromURL(image);
        const { result } = await cloudinary.uploader.destroy(
          `StackRuet/posts/${publicID}`
        );
        if (result !== "ok") {
          throw createError(
            500,
            "Failed to delete product image from Cloudinary"
          );
        }
      }
    }

    // Delete product from database by id
    const post = await Post.findByIdAndDelete(id);

    return successResponse(res, {
      statusCode: 200,
      message: "Product deleted successfully!",
      payload: { post },
    });
  } catch (error) {
    next(error);
  }
};

const likeCommentById = async (req, res, next) => {
  try {
    // Get comment id from request params
    const commentId = req.params.id;
    const options = {};

    const user = await findWithId(User, req.user._id, options);
    const comment = await findWithId(Comment, commentId, options);

    // Check if user already liked the comment
    if (comment.likes.includes(user._id)) {
      // Remove user id from comment likes array
      comment.likes = comment.likes.filter((like) => !like.equals(user._id));

      // Save comment
      const updatedComment = await comment.save();

      return successResponse(res, {
        statusCode: 200,
        message: "Like was removed successfully!",
        payload: { updatedComment },
      });
    }

    // Remove from dislikes if user previously disliked
    if (comment.dislikes.includes(user._id)) {
      comment.dislikes = comment.dislikes.filter(
        (dislike) => !dislike.equals(user._id)
      );
    }

    // Add user id to comment likes array
    comment.likes.push(user._id);

    // Save comment
    const updatedComment = await comment.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Comment was liked successfully!",
      payload: { updatedComment },
    });
  } catch (error) {
    next(error);
  }
};

const dislikeCommentById = async (req, res, next) => {
  try {
    // Get comment id from request params
    const commentId = req.params.id;
    const options = {};

    const user = await findWithId(User, req.user._id, options);
    const comment = await findWithId(Comment, commentId, options);

    // Check if user already disliked the comment
    if (comment.dislikes.includes(user._id)) {
      // Remove user id from comment dislikes array
      comment.dislikes = comment.dislikes.filter(
        (dislike) => !dislike.equals(user._id)
      );

      // Save comment
      const updatedComment = await comment.save();

      return successResponse(res, {
        statusCode: 200,
        message: "Dislike was removed successfully!",
        payload: { updatedComment },
      });
    }

    // Remove from likes if user previously liked
    if (comment.likes.includes(user._id)) {
      comment.likes = comment.likes.filter((like) => !like.equals(user._id));
    }

    // Add user id to comment dislikes array
    comment.dislikes.push(user._id);

    // Save comment
    const updatedComment = await comment.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Comment was disliked successfully!",
      payload: { updatedComment },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  getComments,
  updateCommentById,
  deleteCommentById,
  likeCommentById,
  dislikeCommentById,
};

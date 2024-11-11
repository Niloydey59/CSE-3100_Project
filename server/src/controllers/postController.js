const createError = require("http-errors"); // error-handling middleware

const { successResponse } = require("./responseController");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { findWithId } = require("../services/finditem");

const getPosts = async (req, res, next) => {
  try {
    //pagination and search query params
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    //search filter and options for query
    const filter = {
      $or: [
        { username: { $regex: searchRegExp } },
        { title: { $regex: searchRegExp } },
        { content: { $regex: searchRegExp } },
        { tags: { $in: [searchRegExp] } },
      ],
    };
    const options = {};

    //find posts with filter and options
    const posts = await Post.find(filter, options)
      .populate("author", "username") // populate author field with username
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean();

    //count total posts
    const count = await Post.find(filter).countDocuments();

    //return error if no posts found
    if (!posts || posts.length === 0)
      throw next(createError(404, "No posts found!"));

    return successResponse(res, {
      statusCode: 200,
      message: "Posts were returned succesfully!",
      payload: {
        posts,
        pagination: {
          totalpages: Math.ceil(count / limit),
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

const getPostById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = {};
    const post = await findWithId(Post, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "User were returned succesfully!",
      payload: { post },
    });
  } catch (error) {
    next(error);
  }
};

const updatePostById = async (req, res, next) => {
  try {
    //get post id from request params
    const postid = req.params.id;
    const options = {};
    await findWithId(Post, postid, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    for (let key in req.body) {
      if (["title", "content", "tags"].includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postid,
      updates,
      updateOptions
    );

    if (!updatedPost) throw createError(404, "Post not found!");

    return successResponse(res, {
      statusCode: 200,
      message: "Post was updated succesfully!",
      payload: { updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getPostById, updatePostById };

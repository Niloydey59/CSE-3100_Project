const createError = require("http-errors"); // error-handling middleware

const { successResponse } = require("./responseController");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const { findWithId } = require("../services/finditem");
const cloudinary = require("../config/cloudinary");

const createPost = async (req, res, next) => {
  try {
    console.log("Request Body: ", req.body);
    const { title, content, tags } = req.body;

    // Check if image is uploaded
    const images = req.files;
    if (!images || images.length === 0) {
      throw createError(400, "Image is required");
    }
    // Check each image size
    for (const image of images) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "Each image should be less than 2MB");
      }
    }

    //console.log("Uploaded Image:", images);

    const user = req.user;

    //print post data
    console.log("Post Data: ", {
      username: user.username,
      title,
      content,
      tags,
      author: user,
    });

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const image of images) {
      const response = await cloudinary.uploader.upload(image.path, {
        folder: "StackRuet/posts",
      });
      imageUrls.push(response.secure_url);
    }

    //create product
    const post = await Post.create({
      username: user.username,
      title,
      content,
      tags,
      image: imageUrls,
      author: user,
    });

    return successResponse(res, {
      statusCode: 200,
      message: `Post created successfully`,
      payload: post,
    });
  } catch (error) {
    next(error);
  }
};

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

const likePostById = async (req, res, next) => {
  try {
    //get post id from request params
    //console.log(req.params);
    const postid = req.params.id;
    const options = {};
    //console.log(req.user);
    const user = await findWithId(User, req.user._id, options);
    const post = await findWithId(Post, postid, options);

    //check if user already liked the post
    if (post.likes.includes(user._id)) {
      // remove user id from post likes array
      post.likes = post.likes.filter((like) => !like.equals(user._id));

      // save post
      const updatedPost = await post.save();

      return successResponse(res, {
        statusCode: 200,
        message: "Like was removed successfully!",
        payload: { updatedPost },
      });
    }

    //add user id to post likes array
    post.likes.push(user._id);

    //save post
    const updatedPost = await post.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Post was liked succesfully!",
      payload: { updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

const dislikePostById = async (req, res, next) => {
  try {
    //get post id from request params
    console.log(req.params);
    const postid = req.params.id;
    const options = {};
    console.log(req.user);
    const user = await findWithId(User, req.user._id, options);
    const post = await findWithId(Post, postid, options);

    //check if user already disliked the post
    if (post.dislikes.includes(user._id)) {
      // remove user id from post likes array
      post.dislikes = post.dislikes.filter(
        (dislike) => !dislike.equals(user._id)
      );

      // save post
      const updatedPost = await post.save();

      return successResponse(res, {
        statusCode: 200,
        message: "Dislike was removed successfully!",
        payload: { updatedPost },
      });
    }

    //add user id to post likes array
    post.dislikes.push(user._id);

    //save post
    const updatedPost = await post.save();

    return successResponse(res, {
      statusCode: 200,
      message: "Post was disliked succesfully!",
      payload: { updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePostById,
  likePostById,
  dislikePostById,
};

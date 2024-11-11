const data = require("../data");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const seedUsers = async (req, res, next) => {
  try {
    // Delete all users
    await User.deleteMany({});

    // Create new users
    const users = await User.insertMany(data.users);

    // Success response
    return res.status(201).json(users);
  } catch (error) {
    next(error);
  }
};

const seedPosts = async (req, res, next) => {
  try {
    // Delete all posts
    await Post.deleteMany({});

    const posts = data.posts;
    for (let post of posts) {
      // Find the author of the post
      const author = await User.findOne({ username: post.username });

      // If the author is not found, set the post to null
      if (!author) {
        post = null;
        continue;
      }
      // Replace the username with the author's ID
      post.author = author._id;
    }
    // Create new posts
    await Post.insertMany(posts);
    // Success response
    return res.status(201).json(posts);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUsers, seedPosts };

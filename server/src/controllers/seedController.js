const data = require("../data");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
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

const seedGroups = async (req, res, next) => {
  try {
    // Delete all groups
    await Group.deleteMany({});

    const groups = data.groups;
    for (let group of groups) {
      // Find the admin of the group(default admin JohnDoe)
      const admin = await User.findOne({ username: "JohnDoe" });

      // If the admin is not found, set the group to null
      if (!admin) {
        group = null;
        continue;
      }
      // Replace the username with the admin's ID
      group.admin = admin._id;

      // Replace the members' usernames with their IDs
      const members = [];
      members.push(admin._id);
      group.members = members;
    }

    // Create new groups
    await Group.insertMany(groups);

    // Success response
    return res.status(201).json(groups);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUsers, seedPosts, seedGroups };

const express = require("express");
const {
  seedUsers,
  seedPosts,
  seedGroups,
  seedGroupPosts,
} = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.get("/users", seedUsers);
seedRouter.get("/posts", seedPosts);
seedRouter.get("/groups", seedGroups);
seedRouter.get("/groups/posts", seedGroupPosts);

module.exports = seedRouter;

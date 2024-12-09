const express = require("express");
const {
  seedUsers,
  seedPosts,
  seedGroups,
} = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.get("/users", seedUsers);
seedRouter.get("/posts", seedPosts);
seedRouter.get("/groups", seedGroups);

module.exports = seedRouter;

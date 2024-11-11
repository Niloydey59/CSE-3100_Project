const express = require("express");
const { seedUsers, seedPosts } = require("../controllers/seedController");
const seedRouter = express.Router();

seedRouter.get("/users", seedUsers);
seedRouter.get("/posts", seedPosts);

module.exports = seedRouter;

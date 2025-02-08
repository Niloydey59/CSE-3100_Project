const express = require("express");

const { runValidation } = require("../validators/validation");
const { isLoggedIn } = require("../middlewares/auth");
const {
  getGroups,
  createGroup,
  getGroupById,
  joinGroup,
  leaveGroup,
  getGroupPosts,
  getGroupMembers,
  updateGroup,
} = require("../controllers/groupController");

const groupRouter = express.Router();

// /api/groups common path

groupRouter.post("/", isLoggedIn, createGroup); // Create a group

groupRouter.get("/", getGroups); // Get all groups

groupRouter.get("/:groupId", getGroupById); // Get a single group by ID

groupRouter.put("/:groupId", isLoggedIn, updateGroup); // Update a group

groupRouter.post("/join/:groupId", isLoggedIn, joinGroup); // Join a group

groupRouter.post("/leave/:groupId", isLoggedIn, leaveGroup); // Leave a group

groupRouter.get("/posts/:groupId", getGroupPosts); // Get all posts in a group

groupRouter.get("/members/:groupId", getGroupMembers); // Get all members of a group

module.exports = groupRouter;

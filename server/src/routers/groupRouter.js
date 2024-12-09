const express = require("express");

const { runValidation } = require("../validators/validation");
const { isLoggedIn } = require("../middlewares/auth");
const {
  getGroups,
  createGroup,
  getGroupById,
} = require("../controllers/groupController");

const groupRouter = express.Router();

// /api/groups common path

groupRouter.post("/", isLoggedIn, createGroup); // Create a group

groupRouter.get("/", getGroups); // Get all groups

groupRouter.get("/:groupId", getGroupById); // Get a single group by ID

module.exports = groupRouter;

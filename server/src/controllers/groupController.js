const createError = require("http-errors"); // error-handling middleware

const { successResponse } = require("./responseController");
const Post = require("../models/postModel");
const { findWithId } = require("../services/finditem");
const Group = require("../models/groupModel");
const User = require("../models/userModel");

const createGroup = async (req, res, next) => {
  try {
    console.log("Request Body: ", req.body);
    const { name, description } = req.body;

    const user = req.user;

    //create product
    const group = await Group.create({
      name,
      description,
      admin: user,
      members: [user],
    });

    return successResponse(res, {
      statusCode: 200,
      message: `Post created successfully`,
      payload: group,
    });
  } catch (error) {
    next(error);
  }
};

const getGroups = async (req, res, next) => {
  try {
    //pagination and search query params
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    //search filter and options for query
    const filter = {
      $or: [
        { name: { $regex: searchRegExp } },
        { description: { $regex: searchRegExp } },
      ],
    };
    const options = {};

    //find groups with filter and options
    const groups = await Group.find(filter, options)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean();

    //count total groups
    const count = await Post.find(filter).countDocuments();

    //return error if no groups found
    if (!groups || groups.length === 0)
      throw next(createError(404, "No groups found!"));

    return successResponse(res, {
      statusCode: 200,
      message: "groups were returned succesfully!",
      payload: {
        groups,
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

const getGroupById = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const options = {};
    const group = await findWithId(Group, groupId, options);

    return successResponse(res, {
      statusCode: 200,
      message: "Group was returned succesfully!",
      payload: { group },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
};

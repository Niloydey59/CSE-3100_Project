const createError = require("http-errors"); // error-handling middleware

const { successResponse } = require("./responseController");
const Post = require("../models/postModel");
const { findWithId } = require("../services/finditem");
const Group = require("../models/groupModel");

const createGroup = async (req, res, next) => {
  try {
    console.log("Request Body: ", req.body);
    const { name, description } = req.body;

    const user = req.user;

    //create product
    const group = await Group.create({
      name,
      description,
      admin: user._id,
      members: [
        {
          user: user._id,
          role: "admin",
        },
      ],
    });

    return successResponse(res, {
      statusCode: 200,
      message: `Group created successfully`,
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
    const count = await Group.find(filter).countDocuments();

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

const joinGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const user = req.user;

    const group = await findWithId(Group, groupId, {});

    const isMember = group.members.some(
      (member) => member.user.toString() === user._id.toString()
    );
    if (isMember) {
      throw next(createError(400, "User is already a member of this group"));
    }

    group.members.push({
      user: user._id,
      role: "member",
    });
    await group.save();

    return successResponse(res, {
      statusCode: 200,
      message: "User joined group successfully!",
      payload: { group },
    });
  } catch (error) {
    next(error);
  }
};

const leaveGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const user = req.user;

    const group = await findWithId(Group, groupId, {});

    const isMember = group.members.some(
      (member) => member.user.toString() === user._id.toString()
    );
    if (!isMember) {
      throw next(createError(400, "User is not a member of this group"));
    }

    group.members = group.members.filter(
      (member) => member.user.toString() !== user._id.toString()
    );
    await group.save();

    return successResponse(res, {
      statusCode: 200,
      message: "User left group successfully!",
      payload: { group },
    });
  } catch (error) {
    next(error);
  }
};

const getGroupPosts = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const groupExists = await Group.findById(groupId);
    if (!groupExists) {
      throw next(createError(404, "Group not found"));
    }

    //pagination and search query params
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    //search filter and options for query
    const filter = {
      groupId: groupId,
      $or: [
        { username: { $regex: searchRegExp } },
        { title: { $regex: searchRegExp } },
        { content: { $regex: searchRegExp } },
        { tags: { $in: [searchRegExp] } },
      ],
    };
    const options = {};

    //find groups with filter and options
    const posts = await Post.find(filter, options)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1))
      .lean();

    //count total groups
    const count = await Post.countDocuments(filter);

    //return error if no groups found
    if (!posts || posts.length === 0)
      throw next(createError(404, "No Posts found!"));

    return successResponse(res, {
      statusCode: 200,
      message: `Posts for group: ${groupExists.name}`,
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

const getGroupMembers = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate({
      path: "members.user",
      select: "username",
    });
    if (!group) {
      throw next(createError(404, "Group not found"));
    }

    // Format the members to include user details
    const members = group.members.map((member) => ({
      userId: member.user._id,
      username: member.user.username,
      role: member.role,
      joinedAt: member.joinedAt,
    }));

    return successResponse(res, {
      statusCode: 200,
      message: `Members of group: ${group.name}`,
      payload: members,
    });
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req, res, next) => {
  try {
    //get group id from request params
    const groupId = req.params.groupId;
    const options = {};
    const group = await findWithId(Group, groupId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };

    let updates = {};

    for (let key in req.body) {
      if (["name", "description"].includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      updates,
      updateOptions
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Group updated successfully!",
      payload: { updatedGroup },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupById,
  joinGroup,
  leaveGroup,
  getGroupPosts,
  getGroupMembers,
  updateGroup,
};

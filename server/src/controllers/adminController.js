const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");

// Get all pending verification requests
const getVerificationRequests = async (req, res, next) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      throw createError(403, "Unauthorized. Admin access required");
    }

    // Find users with pending verification requests
    const users = await User.find({
      $or: [
        { "series.pendingApproval": true },
        { "position.pendingApproval": true },
        { "department.pendingApproval": true },
      ],
    }).select("-password");

    // Format the response data
    const requests = users.map((user) => {
      const pendingFields = [];

      if (user.series && user.series.pendingApproval) {
        pendingFields.push("series");
      }

      if (user.position && user.position.pendingApproval) {
        pendingFields.push("position");
      }

      if (user.department && user.department.pendingApproval) {
        pendingFields.push("department");
      }

      return {
        user,
        pendingFields,
        verificationDocument: user.verificationDocument,
        submittedAt: user.updatedAt, // Using updatedAt as a proxy for submission time
      };
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Verification requests fetched successfully",
      payload: {
        requests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Handle verification approval or rejection
const handleVerification = async (req, res, next) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      throw createError(403, "Unauthorized. Admin access required");
    }

    const { userId, field, status } = req.body;

    // Validate request
    if (!userId || !field || !status) {
      throw createError(400, "userId, field and status are required");
    }

    if (!["approve", "reject"].includes(status)) {
      throw createError(400, "Status must be either 'approve' or 'reject'");
    }

    if (!["series", "position", "department"].includes(field)) {
      throw createError(400, "Invalid field");
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Process approval/rejection
    if (status === "approve") {
      if (field === "series") {
        user.series.isApproved = true;
        user.series.pendingApproval = false;
      } else if (field === "position") {
        user.position.isApproved = true;
        user.position.pendingApproval = false;
      } else if (field === "department") {
        user.department.isApproved = true;
        user.department.pendingApproval = false;
      }
    } else {
      // Rejection
      if (field === "series") {
        user.series.value = null;
        user.series.isApproved = false;
        user.series.pendingApproval = false;
      } else if (field === "position") {
        user.position.value = "student"; // Default value
        user.position.isApproved = false;
        user.position.pendingApproval = false;
      } else if (field === "department") {
        user.department.value = null;
        user.department.isApproved = false;
        user.department.pendingApproval = false;
      }
    }

    await user.save();

    return successResponse(res, {
      statusCode: 200,
      message: `Verification ${
        status === "approve" ? "approved" : "rejected"
      } successfully`,
      payload: {
        user: {
          _id: user._id,
          username: user.username,
          [field]: user[field],
        },
        field,
        status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVerificationRequests,
  handleVerification,
};

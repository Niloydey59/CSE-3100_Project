const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Group Name is required"],
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],

    admin: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const Group = model("Groups", groupSchema);

module.exports = Group;

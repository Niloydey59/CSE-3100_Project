const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9_]+$/.test(v);
        },
        message: "Please enter a valid username",
      },
    },

    email: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.−]?\w+)*@\w+([\.−]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "Password can not be less than 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
      default: "",
    },

    series: {
      value: {
        type: Number,

        default: null,
      },

      isApproved: {
        type: Boolean,
        default: false,
      },
      pendingApproval: {
        type: Boolean,
        default: false,
      },
    },

    position: {
      value: {
        type: String,
        enum: [
          "student",
          "professor",
          "associate_professor",
          "assistant_professor",
          "lecturer",
          "lab_assistant",
          "staff",
        ],
        default: null,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      pendingApproval: {
        type: Boolean,
        default: false,
      },
    },

    department: {
      value: {
        type: String,
        enum: ["CSE", "EEE", "ME", "CE", "IPE", "GCE", "MTE", "ETE", "CFPE"],
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      pendingApproval: {
        type: Boolean,
        default: false,
      },
    },

    verificationDocument: {
      type: [String],
      default: [],
    },

    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Groups",
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;

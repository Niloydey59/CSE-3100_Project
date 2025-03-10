const { Schema, model } = require("mongoose");

// username, title, content, tags, author, likes, bookmarks, comments, createdAt, updatedAt, views
const postSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
    },

    tags: {
      type: [String],
      required: false,
      default: [],
    },

    image: {
      type: [String],
      required: false,
      default: [],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Author is required"],
    },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Groups",
      default: null,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Post = model("Posts", postSchema);
module.exports = Post;

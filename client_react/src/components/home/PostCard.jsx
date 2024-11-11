// src/components/PostItem.jsx
import React from "react";

import "../../styling/postItem.css";

const PostItem = ({ post }) => {
  const truncate = (str, n) => {
    return str.length > n ? str.substring(0, n) + "..." : str;
  };

  return (
    <div className="post-item">
      <h2>{truncate(post.title, 50)}</h2>
      <p>{truncate(post.content, 100)}</p>

      <div className="post-tags">
        {post.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="post-stats">
        <span>By {post.author.username}</span>
        <span>{post.likes.length} Likes</span>
        <span>{post.comments.length} Comments</span>
      </div>
    </div>
  );
};

export default PostItem;

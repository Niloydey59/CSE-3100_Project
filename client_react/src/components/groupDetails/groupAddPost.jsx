import React, { useState } from "react";

// Api
import { createPost } from "../../FetchApi";
// Styling
import "../../styling/groupDetails/addPost.css";

const GroupAddPost = ({ groupId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }
    try {
      await createPost({ groupId, title, content });
      alert("Post added successfully!");
      setTitle("");
      setContent("");
      // Reload posts logic here
    } catch (error) {
      alert("Failed to add post.");
    }
  };

  return (
    <div className="add-post-section">
      <h2>Add a New Post</h2>
      <form onSubmit={handleAddPost} className="add-post-form">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

export default GroupAddPost;

import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Context
import { useAuth } from "../context/authcontext";
// API
import { createPost } from "../FetchApi";
// Styling
import "../styling/createPost.css";

const AddPostPage = () => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const { groupId } = useParams(); // Get groupId from URL if it exists
  console.log("Group ID:", groupId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const [showPopup, setShowPopup] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files); // Update the images state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setShowPopup(true); // Show popup if user is not logged in
      return;
    }

    if (!title || !content) {
      setError("Title and content are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // Add tags as an array
      tags
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => formData.append("tags[]", tag));

      // Append images
      images.forEach((image) => formData.append("image", image));

      // Include groupId if it exists
      if (groupId) {
        formData.append("groupId", groupId);
      }

      const response = await createPost(formData); // API call
      if (response.success) {
        alert("Post created successfully!");
        setTitle("");
        setContent("");
        setTags("");
        setImages([]);
        navigate(groupId ? `/groups/${groupId}` : "/"); // Navigate to group or home
      } else {
        setError("Failed to create a post.");
      }
    } catch (err) {
      console.error(err.message);
      setError("An error occurred while creating the post.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="create-post">
      <h2>{groupId ? "Add a Post to the Group" : "Create a Post"}</h2>

      {/* Error message */}
      {error && <p className="error">{error}</p>}

      {/* Create Post Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">{groupId ? "Add Group Post" : "Add Post"}</button>
      </form>

      {/* Authentication Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>You need to log in</h2>
            <p>Login to create posts.</p>
            <div className="popup-actions">
              <Link to="/login" className="popup-button">
                Login Now
              </Link>
              <button className="popup-button close" onClick={closePopup}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPostPage;

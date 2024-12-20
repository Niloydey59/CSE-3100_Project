import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext"; // To get currentUser
import { createPost } from "../../FetchApi"; // API call to create a post
import "../../styling/home/createPost.css"; // Styling for the component

const CreatePost = ({ addPost }) => {
  const { currentUser } = useAuth(); // Get current user from auth context
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files); // Update the images state with selected files
  };

  const handleSubmit = async (e) => {
    console.log("Creating post...");
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
      tags
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => formData.append("tags[]", tag)); // Split tags into an array and append each tag individually
      images.forEach((image) => formData.append("image", image)); // Append each image

      const data = await createPost(formData); // API call
      if (data.success) {
        console.log("Post created:", data.payload);
        addPost(data.payload); // Add the new post to the PostList
        setTitle("");
        setContent("");
        setTags("");
        setImages([]);
        setError("");
      } else {
        setError("Failed to create a post.");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message);
    }
  };

  // close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="create-post">
      <h2>Create a Post</h2>

      {error && <p className="error">{error}</p>}

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

        <button type="submit">Post</button>
      </form>

      {/* {Popup Menu}  */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>You need to log in</h2>
            <p>Login to Create posts.</p>
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

export default CreatePost;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { useAuth } from "../../context/authcontext";
// Styling
import "../../styling/home/createPostBanner.css";

const CreatePostBanner = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [inputText, setInputText] = useState("");

  const handleCreatePost = () => {
    if (!currentUser) {
      // Handle not logged in state
      return;
    }
    navigate(`/add-post/${inputText}`);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="create-post-banner">
      <div className="banner-content">
        <div className="profile-section">
          <div className="profile-icon">
            {currentUser?.photoURL ? (
              <img src={currentUser.photoURL} alt="profile" />
            ) : (
              <div className="default-avatar">
                {currentUser?.displayName?.[0] || "?"}
              </div>
            )}
          </div>
        </div>
        <div className="post-input-section">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            className="post-input"
            placeholder="What's on your mind?"
          />
        </div>
        <button className="create-post-button" onClick={handleCreatePost}>
          Create Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostBanner;

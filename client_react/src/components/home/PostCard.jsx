import React, { useState } from "react";
import { Link } from "react-router-dom";

import { dislikePost, likePost } from "../../FetchApi";
import { useAuth } from "../../context/authcontext";

// Styling
import "../../styling/home/postItem.css";

const PostItem = ({ post, updatePost, showActions, onAction }) => {
  const { currentUser } = useAuth(); // Get currentUser from context
  const [showPopup, setShowPopup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const truncate = (str, n) => {
    return str.length > n ? str.substring(0, n) + "..." : str; // Truncate the string if it's longer than n
  };

  const handleLike = async (id) => {
    if (!currentUser) {
      setShowPopup(true); // Show popup if user is not logged in
      return;
    }

    try {
      const data = await likePost(id);
      console.log("Post liked:", data.payload.updatedPost);
      updatePost(data.payload.updatedPost); // Update the post in the parent component
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDislike = async (id) => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    try {
      const data = await dislikePost(id);
      console.log("Post disliked:", data.payload.updatedPost);
      updatePost(data.payload.updatedPost); // Update the post in the parent component
    } catch (error) {
      console.error(error.message);
    }
  };

  // close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Handle the action from the dropdown menu (update or delete)
  const handleAction = (action) => {
    setShowMenu(false);
    onAction(action, post._id);
  };

  // Check if the currentUser has liked or disliked the post
  const hasLiked = currentUser && post.likes.includes(currentUser._id); // Assuming currentUser has _id
  const hasDisliked = currentUser && post.dislikes.includes(currentUser._id);

  //console.log(hasLiked, hasDisliked);

  return (
    <div className="post-item">
      {/* Show dropdown menu if showActions is true */}
      {showActions && (
        <div className="actions">
          <button
            className="action-icon"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => handleAction("update")}>Update</button>
              <button onClick={() => handleAction("delete")}>Delete</button>
            </div>
          )}
        </div>
      )}

      {/* Post Details Link and Post contents*/}
      <Link to={`/post/${post._id}`} className="post-title">
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
        </div>
      </Link>

      {/* Post Actions */}
      <div className="post-actions">
        <span className={`action-button`} onClick={() => handleLike(post._id)}>
          <div className={`like-icon${hasLiked ? "liked" : ""}`}>
            <i className="fa-solid fa-thumbs-up">{post.likes.length}</i>
          </div>
        </span>
        <span
          className={`action-button`}
          onClick={() => handleDislike(post._id)}
        >
          <div className={`like-icon${hasDisliked ? "disliked" : ""}`}>
            <i className="fa-solid fa-thumbs-down">{post.dislikes.length}</i>
          </div>
        </span>
        <span>
          <i class="fa-regular fa-comment"></i>
          {post.comments.length}
        </span>
      </div>

      {/* {Popup Menu}  */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>You need to log in</h2>
            <p>Login to like or dislike posts.</p>
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

export default PostItem;

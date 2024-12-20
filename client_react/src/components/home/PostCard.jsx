import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styling/home/postItem.css";
import { dislikePost, likePost } from "../../FetchApi";
import { useAuth } from "../../context/authcontext"; // Import useAuth to get currentUser

const PostItem = ({ post, updatePost }) => {
  const { currentUser } = useAuth(); // Get currentUser from context
  const [showPopup, setShowPopup] = useState(false);

  const truncate = (str, n) => {
    return str.length > n ? str.substring(0, n) + "..." : str;
  };

  const handleLike = async (id) => {
    if (!currentUser) {
      setShowPopup(true);
      return;
    }

    try {
      const data = await likePost(id);
      console.log("Post liked:", data.payload.updatedPost);
      updatePost(data.payload.updatedPost); // Update the post in the parent component
    } catch (error) {
      console.error("Error liking post:", error);
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
      console.error("Error disliking post:", error);
    }
  };

  // close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  // Check if the currentUser has liked or disliked the post
  const hasLiked = currentUser && post.likes.includes(currentUser._id); // Assuming currentUser has _id
  const hasDisliked = currentUser && post.dislikes.includes(currentUser._id);

  console.log(hasLiked, hasDisliked);

  return (
    <div className="post-item">
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
        <span>{post.comments.length} Comments</span>
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

import { useState } from "react";
import { Link } from "react-router-dom";

// API
import { dislikePost, likePost } from "../../FetchApi";
// Context
import { useAuth } from "../../context/authcontext";
// Styling
import "../../styling/posts/postItem.css";
import Popup from "../common/Popup";

const PostItem = ({ post, updatePost, showActions, onAction }) => {
  const { currentUser } = useAuth(); // Get currentUser from context

  // states
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const truncate = (str, n) => {
    return str.length > n ? str.substring(0, n) + "..." : str; // Truncate the string if it's longer than n
  };

  const handleLike = async (id) => {
    if (!currentUser) {
      setShowLoginPopup(true); // Show popup if user is not logged in
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
      setShowLoginPopup(true);
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
    setShowLoginPopup(false);
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
          {/* Dropdown Button */}
          <button
            className="action-icon"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>

          {/* Dropdown Menu */}
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
        {/* Likes */}
        <span className={`action-button`} onClick={() => handleLike(post._id)}>
          <div className={`like-icon${hasLiked ? "liked" : ""}`}>
            <i className="fa-solid fa-thumbs-up">{post.likes.length}</i>
          </div>
        </span>
        {/* Dislikes */}
        <span
          className={`action-button`}
          onClick={() => handleDislike(post._id)}
        >
          <div className={`like-icon${hasDisliked ? "disliked" : ""}`}>
            <i className="fa-solid fa-thumbs-down">{post.dislikes.length}</i>
          </div>
        </span>
        {/* Comments */}
        <span>
          <i class="fa-regular fa-comment"></i>
          {post.comments.length}
        </span>
      </div>

      {/* Login Popup */}
      <Popup
        isVisible={showLoginPopup}
        title="You need to log in"
        message="Login to add a post."
        onClose={closePopup}
      />
    </div>
  );
};

export default PostItem;

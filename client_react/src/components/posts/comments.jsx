import { useState, useEffect } from "react";

// Context
import { useAuth } from "../../context/authcontext";
// API
import { fetchComments, addComment } from "../../FetchApi";
// Styling
import "../../styling/posts/comments.css";
import Popup from "../common/Popup";

const Comments = ({ postId }) => {
  const { currentUser } = useAuth();
  // States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Load comments when the component mounts
  useEffect(() => {
    const loadComments = async () => {
      try {
        const data = await fetchComments(postId); // Fetch comments from API
        setComments(data.payload.comments); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!currentUser) {
      setShowLoginPopup(true); // Show login popup if user is not logged in
      return;
    }

    if (!newComment.trim()) return; // Prevent empty comments

    try {
      const content = newComment.trim();
      const commentData = { content };

      const data = await addComment(commentData, postId);

      setComments((prevComments) => [...prevComments, data.payload]); // Append the new comment
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // close the popup
  const closePopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <div className="comments-section">
      {/* Headline */}
      <h2>Comments</h2>

      {/* Comments list */}
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>
                <strong>{comment.author.username}:</strong> {comment.content}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Add comment form */}
      <div className="add-comment">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button onClick={handleAddComment}>Submit</button>
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

export default Comments;

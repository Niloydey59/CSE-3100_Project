import { useState, useEffect } from "react";

// Context
import { useAuth } from "../../context/authcontext";
// API
import { fetchComments, addComment } from "../../FetchApi";
// Styling
import "../../styling/posts/comments.css";
// Components
import Popup from "../common/popup";

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
      const newCommentData = {
        ...data.payload,
        author: {
          _id: currentUser._id,
          username: currentUser.username,
          photoURL: currentUser.photoURL || null,
        },
      };
      console.log("Comment added:", data.payload);

      setComments((prevComments) => [...prevComments, newCommentData]); // Append the new comment
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
      <h2>Comments ({comments.length})</h2>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <div className="comment-avatar">
                  {comment.author.photoURL ? (
                    <img
                      src={comment.author.photoURL}
                      alt={comment.author.username}
                    />
                  ) : (
                    comment.author.username[0]
                  )}
                </div>
                <span className="comment-author">
                  {comment.author.username}
                </span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        ) : (
          <div className="no-comments">
            <i className="fa-regular fa-comment"></i>
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      <div className="add-comment">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>

      <Popup
        isVisible={showLoginPopup}
        title="You need to log in"
        message="Login to add a comment."
        onClose={closePopup}
      />
    </div>
  );
};

export default Comments;

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authcontext";
import "../../styling/postDetails/comments.css";
import { fetchComments, addComment } from "../../FetchApi";

const Comments = ({ postId }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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

  return (
    <div className="comments-section">
      <h2>Comments</h2>
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

      {currentUser && (
        <div className="add-comment">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button onClick={handleAddComment}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Comments;

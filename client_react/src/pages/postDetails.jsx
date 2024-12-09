// src/pages/PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostDetails } from "../FetchApi/index";
import "../styling/postDetails/PostDetails.css";

const PostDetails = () => {
  const { postId } = useParams(); // Extract post ID from the URL
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPostDetails = async () => {
      try {
        const data = await fetchPostDetails(postId); // Fetch post details
        console.log("Data received:", data);
        setPost(data.payload.post);
        console.log("Post details:", post);
      } catch (error) {
        console.error("Failed to load post details:", error);
      }
    };

    loadPostDetails();
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p>By {post.username}</p>
      <p>{post.content}</p>

      <div className="post-stats">
        <span>{post.likes.length} Likes</span>
        <span>{post.comments.length} Comments</span>
      </div>

      <div className="post-tags">
        <strong>Tags:</strong> {post.tags.join(", ")}
      </div>
    </div>
  );
};

export default PostDetails;

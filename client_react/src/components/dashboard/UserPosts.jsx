import React, { useEffect, useState } from "react";

import { deletePostById, fetchPosts, fetchUserPosts } from "../../FetchApi";
// Components
import PostList from "../home/PostList";
// Styling
import "../../styling/dashboard/userPosts.css";
import { useNavigate } from "react-router-dom";

const UserPosts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPosts, setTotalPosts] = useState(0); // Add totalPosts state
  const limit = 5; // Posts per page

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchUserPosts();
        console.log("Data received:", data);
        if (data && data.payload && data.payload.posts) {
          setPosts(data.payload.posts);
          setTotalPosts(data.payload.pagination.totalpages * limit); // Update totalPosts
          setError("");
        } else {
          console.error("Unexpected data structure:", data);
          setError("Failed to fetch posts.");
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
        setError("An error occurred while fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [page]);

  const handlePostAction = async (action, postId) => {
    if (action === "update") {
      try {
        // navigate to the update post page
        navigate(`/post/update/${postId}`);
      } catch (error) {
        console.error("Failed to update post:", error.message);
      }
    } else if (action === "delete") {
      if (window.confirm("Are you sure you want to delete this post?")) {
        try {
          // Call the delete API
          const response = await deletePostById(postId);
          console.log("Deleted post:", response);

          setPosts((prevPosts) => {
            console.log("Previous posts:", prevPosts);
            console.log("Post ID to delete:", postId);

            const updatedPosts = prevPosts.filter((post) => {
              console.log("Checking post:", post);
              if (post._id === postId) {
                console.log("Post found:");
              }
              return post._id !== postId;
            });

            console.log("Updated posts:", updatedPosts);
            return updatedPosts;
          });

          alert("Post deleted successfully.");
        } catch (error) {
          console.error("Failed to delete post:", error.message);
        }
      }
    }
  };

  return (
    <div className="user-posts">
      <h2>Your Posts</h2>
      <div className="post-section">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <PostList
            posts={posts}
            setPosts={setPosts}
            setPage={setPage}
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalPosts / limit), // Use updated totalPosts
              previousPage: page > 1 ? page - 1 : null,
              nextPage:
                page + 1 <= Math.ceil(totalPosts / limit) ? page + 1 : null,
            }}
            showActions={true}
            onAction={handlePostAction}
          />
        )}
      </div>
    </div>
  );
};

export default UserPosts;

import React, { useEffect, useState } from "react";

// components
import PostItem from "./PostCard";
// api
import { fetchPosts } from "../../FetchApi/index";
// styling
import "../../styling/posts/postList.css";

const PostList = ({
  posts,
  setPosts,
  setPage,
  pagination,
  showActions,
  onAction,
}) => {
  //console.log("No of posts:", posts.length);
  const showPagination = posts.length > 0;
  //console.log("Show Pagination:", showPagination);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.nextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="post-list">
      {/* Render the list of posts */}
      {posts.length > 0 ? (
        posts.map((post) => (
          /* Post Card */
          <PostItem
            key={post._id}
            post={post}
            updatePost={updatePost}
            showActions={showActions}
            onAction={onAction}
          />
        ))
      ) : (
        <p>No posts found.</p>
      )}

      {/* Pagination Controls */}
      {showPagination && (
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={!pagination.previousPage}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!pagination.nextPage}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;

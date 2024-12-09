import React, { useEffect, useState } from "react";

import PostItem from "./PostCard";
import { fetchPosts } from "../../FetchApi/index";
import "../../styling/home/postList.css";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log("Data received:", data);
        if (data && data.payload && data.payload.posts) {
          setPosts(data.payload.posts);
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    };

    loadPosts();
  }, []);

  const updatePost = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostItem key={post._id} post={post} updatePost={updatePost} />
      ))}
    </div>
  );
};

export default PostList;

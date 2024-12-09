import React from "react";

const GroupPosts = ({ posts }) => {
  return (
    <div className="group-posts">
      <h2>Group Posts</h2>
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="group-post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts in this group yet.</p>
      )}
    </div>
  );
};

export default GroupPosts;

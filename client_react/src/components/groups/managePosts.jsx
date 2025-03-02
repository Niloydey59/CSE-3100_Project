import { useEffect, useState } from "react";

// Api
import { fetchGroupPosts } from "../../FetchApi";

const ManagePosts = ({ groupId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchGroupPosts(groupId);
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setLoading(false);
      }
    };
    getPosts();
  }, [groupId]);

  const handleDeletePost = (postId) => {
    // Handle deleting a post logic
    console.log("Deleting post:", postId);
  };

  return (
    <div>
      <h3>Manage Posts</h3>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              {post.title}
              <button onClick={() => handleDeletePost(post._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagePosts;

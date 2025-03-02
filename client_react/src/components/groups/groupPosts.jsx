import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Components
import PostList from "../posts/PostList";
// Styling
import "../../styling/groups/groupPosts.css";
// API
import { fetchGroupPosts } from "../../FetchApi";

const GroupPosts = () => {
  const { groupId } = useParams();
  // States
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const limit = 5;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchGroupPosts({ groupId, search, limit, page });
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
        console.error("Failed to load posts:", error.message);
        if (error.message === "No Posts found!") {
          console.log("Hello.");
          setPosts([]);
          setTotalPosts(0);
          setError("");
        } else
          setError("An error occurred while fetching posts.", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [search, page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="group-posts-list">
      <h2 className="group-posts-title">Posts</h2>

      {/* Posts section */}
      {posts.length === 0 ? (
        () => <p>No posts found.</p>
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
        />
      )}
    </div>
  );
};

export default GroupPosts;

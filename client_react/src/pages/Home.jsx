import { useEffect, useState } from "react";

// Context
import { useAuth } from "../context/authcontext";

// components
import PageTitle from "../components/common/pageTitle";
import Sidebar from "../components/home/sidebar";
import PostList from "../components/posts/postList";
import Popup from "../components/common/popup";
import CreatePostBanner from "../components/home/createPostBanner";

// API
import { fetchPosts } from "../FetchApi";

// styling
import "../styling/home/home.css";

const Home = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPosts, setTotalPosts] = useState(0); // Add totalPosts state
  const limit = 5; // Posts per page

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts({ search, limit, page });
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
        setError("An error occurred while fetching posts.", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [search, page]);

  const closePopup = () => {
    setShowLoginPopup(false);
  };

  // Loding state
  if (loading) return <p>Loading...</p>;
  // Error state
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <PageTitle title="Home" />
      <div className="main-content">
        {/* Sidebar Section with mobile support */}
        <Sidebar />

        {/* Post Section */}
        <div className="post-section">
          <CreatePostBanner />
          <PostList
            posts={posts}
            setPosts={setPosts}
            setPage={setPage}
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalPosts / limit),
              previousPage: page > 1 ? page - 1 : null,
              nextPage:
                page + 1 <= Math.ceil(totalPosts / limit) ? page + 1 : null,
            }}
          />
        </div>
      </div>

      {/* Popup for login */}
      <Popup
        isVisible={showLoginPopup}
        title="You need to log in"
        message="Login to add a post."
        onClose={closePopup}
      />
    </div>
  );
};

export default Home;

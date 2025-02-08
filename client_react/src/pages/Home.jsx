import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
// Context
import { useAuth } from "../context/authcontext";
// components
import PageTitle from "../components/common/PageTitle";
import Sidebar from "../components/home/Sidebar";
import PostList from "../components/home/PostList";
import CreatePost from "../components/home/CreatePost";
import Popup from "../components/common/Popup";
// API
import { fetchPosts } from "../FetchApi";
// styling
import "../styling/home/home.css";

const Home = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();
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

  const handleAddPost = () => {
    if (!currentUser) {
      setShowLoginPopup(true);
      return;
    }
    console.log("Adding post...");
    navigate(`/add-post`);
    // Add logic to show the add post form
  };

  const closePopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <div>
      <PageTitle title="Home Page" />
      <div className="main-content">
        <Sidebar />
        <div className="post-section">
          <div className="add-post-banner">
            <button className="btn-create-post" onClick={handleAddPost}>
              Add Post
            </button>
          </div>

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
            />
          )}
        </div>
      </div>
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

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "../styling/home/home.css";

import PageTitle from "../components/common/PageTitle";
import PostList from "../components/home/PostList";
import { fetchPosts } from "../FetchApi";

const SearchResults = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 5;

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPosts({ search: searchQuery, limit, page });
        if (data && data.payload && data.payload.posts) {
          setPosts(data.payload.posts);
          setTotalPosts(data.payload.pagination.totalpages * limit);
          setError("");
        } else {
          setError("No results found.");
        }
      } catch (err) {
        setError(err.response.data.message || "Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [searchQuery, page]);

  return (
    <div>
      <PageTitle title="Search Results" />
      <div className="main-content">
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
                totalPages: Math.ceil(totalPosts / limit),
                previousPage: page > 1 ? page - 1 : null,
                nextPage:
                  page + 1 <= Math.ceil(totalPosts / limit) ? page + 1 : null,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// API
import { fetchGroups } from "../FetchApi";
// Context
import { useAuth } from "../context/authcontext";
// Components
import GroupList from "../components/groups/groupsList";
// Styling
import "../styling/groups/groups.css";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const { currentUser } = useAuth();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalGroups, setTotalGroups] = useState(0);
  const limit = 6; // groups per page

  // Fetch groups from the backend
  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const data = await fetchGroups({ search, limit, page });
        console.log("Data received:", data);
        if (data && data.payload && data.payload.groups) {
          setGroups(data.payload.groups);
          console.log("Groups loaded:", data.payload.groups);
          setTotalGroups(data.payload.pagination.totalpages * limit);
          setError("");
        } else {
          console.error("Unexpected data structure:", data);
          setError("Failed to fetch groups.");
        }
      } catch (error) {
        console.error("Error fetching groups:", error.message);
        setError("An error occurred while fetching groups.", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, [search, page]);

  const addGroup = (newGroup) => {
    setGroups((prevGroups) => [newGroup, ...prevGroups]);
  };

  return (
    <div className="groups-page">
      <Helmet>
        <title>Groups List</title>
      </Helmet>
      <div className="groups-header">
        <h1>Groups</h1>
        <p>Join and explore groups that interest you!</p>
        {currentUser && (
          <Link to="/create-group" className="create-group-link">
            Create a Group
          </Link>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <GroupList
          groups={groups}
          setGroups={setGroups}
          setPage={setPage}
          pagination={{
            currentPage: page,
            totalPages: Math.ceil(totalGroups / limit),
            previousPage: page > 1 ? page - 1 : null,
            nextPage:
              page + 1 <= Math.ceil(totalGroups / limit) ? page + 1 : null,
          }}
        />
      )}
    </div>
  );
};

export default Groups;

import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import GroupList from "../components/groups/groupsList";
import "../styling/groups/groups.css";
import { fetchGroups } from "../FetchApi";

const Groups = () => {
  const [groups, setGroups] = useState([]);

  // Fetch groups from the backend
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        console.log("Data received:", data);
        if (data && data.payload && data.payload.groups) {
          setGroups(data.payload.groups);
          console.log("Posts loaded:", data.payload.groups);
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    loadGroups();
  }, []);

  return (
    <div className="groups-page">
      <Helmet>
        <title>Groups List</title>
      </Helmet>
      <div className="groups-header">
        <h1>Groups</h1>
        <p>Join and explore groups that interest you!</p>
      </div>
      <GroupList groups={groups} />
    </div>
  );
};

export default Groups;

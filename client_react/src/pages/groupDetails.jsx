import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { fetchGroupDetails } from "../FetchApi"; // Ensure the correct import path

import GroupHeader from "../components/GroupDetails/GroupHeader";
import GroupPosts from "../components/GroupDetails/GroupPosts";
import GroupActions from "../components/GroupDetails/GroupActions";
import "../styling/groups/groupDetails.css";

const GroupDetailsPage = () => {
  const { groupId } = useParams(); // Get group ID from the URL
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);

  // Fetch group details from the backend
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        console.log("Fetching group details for ID:", groupId);
        const data = await fetchGroupDetails(groupId);
        console.log("Data received:", data);
        if (data && data.payload && data.payload.group) {
          setGroup(data.payload.group);
          console.log("Group details loaded:", data.payload.group);
        } else {
          setError("Failed to fetch group details");
        }
      } catch (error) {
        setError("Error fetching group details");
        console.error("Error fetching group details:", error);
      }
    };

    fetchDetails();
  }, [groupId]);

  if (error) {
    return <div className="group-details-error">{error}</div>;
  }

  if (!group) {
    return <div className="group-details-error">Group not found.</div>;
  }

  return (
    <div className="group-details-page">
      <Helmet>
        <title>{group.name} - Group Details</title>
      </Helmet>
      <GroupHeader name={group.name} description={group.description} />
      <GroupActions isAdmin={group.isAdmin} />
      <GroupPosts posts={group.posts} />
    </div>
  );
};

export default GroupDetailsPage;

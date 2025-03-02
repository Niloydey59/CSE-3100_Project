import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

// Api
import { fetchGroupDetails } from "../../FetchApi";
// Components
import GroupHeader from "../../components/groups/GroupHeader";
import GroupPosts from "../../components/groups/GroupPosts";
import GroupSidebar from "../../components/groups/GroupSidebar";
// Styling
import "../../styling/groups/groupDetails.css";

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await fetchGroupDetails(groupId);
        setGroup(data.payload.group);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchGroup();
  }, [group]);

  if (error) {
    return <div className="group-details-page-error">{error}</div>;
  }

  if (!group) {
    return <div className="group-details-page-loading">Loading...</div>;
  }

  return (
    <div className="group-details-page">
      <Helmet>
        <title>{group.name} - Group Details</title>
      </Helmet>
      <GroupHeader group={group} />
      <div className="group-details-content">
        <div className="group-details-main-content">
          <GroupPosts />
        </div>
        <GroupSidebar members={group.members} />
      </div>
    </div>
  );
};

export default GroupDetailsPage;

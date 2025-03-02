import React, { useState } from "react";
import { Helmet } from "react-helmet";

// Components
import ManageMembers from "../../components/groups/manageMembers";
import ManagePosts from "../../components/groups/managePosts";
import GroupSettings from "../../components/groups/groupSettings";
// Styling
import "../../styling/groups/manageGroup.css";

const ManageGroupPage = ({ groupId }) => {
  const [activeTab, setActiveTab] = useState("members");

  return (
    <div className="manage-group-page">
      <Helmet>
        <title>Manage Group - Admin Panel</title>
      </Helmet>
      <h2>Manage Group</h2>
      <div className="manage-group-tabs">
        <button
          className={`manage-group-tab ${
            activeTab === "members" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={`manage-group-tab ${
            activeTab === "posts" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`manage-group-tab ${
            activeTab === "settings" ? "active-tab" : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>
      <div className="manage-group-content">
        {activeTab === "members" && <ManageMembers groupId={groupId} />}
        {activeTab === "posts" && <ManagePosts groupId={groupId} />}
        {activeTab === "settings" && <GroupSettings groupId={groupId} />}
      </div>
    </div>
  );
};

export default ManageGroupPage;

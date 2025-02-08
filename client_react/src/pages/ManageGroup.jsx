import React, { useState } from "react";
import { Helmet } from "react-helmet";
import "../styling/manageGroup/manageGroup.css";

// Components
import ManageMembers from "../components/ManageGroup/manageMembers";
import ManagePosts from "../components/manageGroup/managePosts";
import GroupSettings from "../components/ManageGroup/groupSettings";

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

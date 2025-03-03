import React, { useState } from "react";

import { useAuth } from "../context/authcontext";

// Components
import DashSidebar from "../components/dashboard/dashSidebar";
import UserInfo from "../components/dashboard/userInfo";
import UserPosts from "../components/dashboard/userPosts";
import UserGroups from "../components/dashboard/userGroups";
// Styling
import "../styling/dashboard/dashboard.css";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("userInfo");

  if (!currentUser) {
    return <div className="loading">Loading user data...</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "userInfo":
        return <UserInfo />;
      case "userPosts":
        return <UserPosts />;
      case "userGroups":
        return <UserGroups />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <DashSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logout={logout}
      />
      <div className="dashboard-content">
        <h1>Welcome, {currentUser.username}!</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

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
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("userInfo");

  if (!user) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading user data...
      </div>
    );
  }

  // Format position for display
  const formatPosition = (position) => {
    if (!position) return "";
    return position
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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
        <div className="welcome-section">
          <div className="welcome-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.username} />
            ) : (
              user.username[0].toUpperCase()
            )}
          </div>
          <div className="welcome-text">
            <h1>Welcome back, {user.username}!</h1>
            <div className="welcome-subtitle">
              Ready to share your knowledge?
            </div>
          </div>
        </div>

        <div className="stats-container">
          {user.series && user.series.isApproved && (
            <div className="stat-card verified-stat">
              <div className="stat-icon">
                <i className="fa-solid fa-calendar-alt"></i>
              </div>
              <div className="stat-value">{user.series.value}</div>
              <div className="stat-label">Series</div>
            </div>
          )}

          {user.department && user.department.isApproved && (
            <div className="stat-card verified-stat">
              <div className="stat-icon">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <div className="stat-value">{user.department.value}</div>
              <div className="stat-label">Department</div>
            </div>
          )}

          {user.position && user.position.isApproved && (
            <div className="stat-card verified-stat">
              <div className="stat-icon">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div className="stat-value">
                {formatPosition(user.position.value)}
              </div>
              <div className="stat-label">Position</div>
            </div>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";

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
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalGroups: 0,
    totalLikes: 0,
  });

  useEffect(() => {
    // Fetch user stats here
    const fetchStats = async () => {
      try {
        // Replace with actual API calls
        setStats({
          totalPosts: 15,
          totalGroups: 3,
          totalLikes: 45,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!currentUser) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading user data...
      </div>
    );
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
        <div className="welcome-section">
          <div className="welcome-avatar">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt={currentUser.username} />
            ) : (
              currentUser.username[0].toUpperCase()
            )}
          </div>
          <div className="welcome-text">
            <h1>Welcome back, {currentUser.username}!</h1>
            <div className="welcome-subtitle">
              Ready to share your knowledge?
            </div>
            <div className="last-login">
              Last login: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{stats.totalPosts}</div>
            <div className="stat-label">Total Posts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalGroups}</div>
            <div className="stat-label">Groups Joined</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalLikes}</div>
            <div className="stat-label">Total Likes</div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

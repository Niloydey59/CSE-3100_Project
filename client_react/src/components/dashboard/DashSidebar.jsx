import React from "react";

// Styling
import "../../styling/dashboard/dashSidebar.css";

const DashSidebar = ({ activeTab, setActiveTab, logout }) => {
  return (
    <div className="Dashsidebar">
      {/* Dashboard Header */}
      <h3>Dashboard</h3>

      {/* Navigation List */}
      <ul>
        {/* User Information Tab */}
        <li
          onClick={() => setActiveTab("userInfo")}
          className={activeTab === "userInfo" ? "active" : ""}
        >
          User Information
        </li>

        {/* User Posts Tab */}
        <li
          onClick={() => setActiveTab("userPosts")}
          className={activeTab === "userPosts" ? "active" : ""}
        >
          User Posts
        </li>

        {/* User Groups Tab */}
        <li
          onClick={() => setActiveTab("userGroups")}
          className={activeTab === "userGroups" ? "active" : ""}
        >
          User Groups
        </li>

        {/* Logout Button */}
        <li onClick={logout} className="logout">
          Logout
        </li>
      </ul>
    </div>
  );
};

export default DashSidebar;

import React from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook to access current user

const Dashboard = () => {
  const { currentUser, logout } = useAuth(); // Access current user and logout function

  return (
    <div>
      {currentUser ? (
        <div>
          <h1>Welcome, {currentUser.username}!</h1>
          <button onClick={logout}>Logout</button> {/* Logout button */}
        </div>
      ) : (
        <div>Please log in to access the dashboard.</div>
      )}
    </div>
  );
};

export default Dashboard;

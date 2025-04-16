import { useState, useEffect } from "react";

// Styling
import "../../styling/admin/users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-container">
      <h2>Manage Users</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <img src={user.avatar || "/default-avatar.png"} alt="User avatar" />
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
              <p>Status: {user.status}</p>
            </div>
            <div className="user-actions">
              <button
                onClick={() =>
                  handleStatusChange(
                    user._id,
                    user.status === "active" ? "suspended" : "active"
                  )
                }
                className={
                  user.status === "active" ? "suspend-btn" : "activate-btn"
                }
              >
                {user.status === "active" ? "Suspend" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;

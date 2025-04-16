import { useNavigate } from "react-router-dom";

// Styling
import "../../styling/dashboard/dashSidebar.css";
// Context
import { useAuth } from "../../context/authcontext";

const DashSidebar = ({ activeTab, setActiveTab, logout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    navigate("/admin");
  };

  return (
    <div className="Dashsidebar">
      <h3>Dashboard</h3>
      <ul>
        <li
          onClick={() => setActiveTab("userInfo")}
          className={activeTab === "userInfo" ? "active" : ""}
        >
          <i className="fa-solid fa-user"></i>
          User Information
        </li>

        <li
          onClick={() => setActiveTab("userPosts")}
          className={activeTab === "userPosts" ? "active" : ""}
        >
          <i className="fa-solid fa-file-lines"></i>
          My Posts
        </li>

        <li
          onClick={() => setActiveTab("userGroups")}
          className={activeTab === "userGroups" ? "active" : ""}
        >
          <i className="fa-solid fa-users"></i>
          My Groups
        </li>

        {/* Admin Button - Only visible to admin users */}
        {user.isAdmin && (
          <li onClick={handleAdminClick} className="admin-button">
            <i className="fa-solid fa-shield-halved"></i>
            Admin Panel
          </li>
        )}

        <li onClick={logout} className="logout">
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default DashSidebar;

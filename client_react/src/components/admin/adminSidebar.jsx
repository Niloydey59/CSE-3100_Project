import { useNavigate } from "react-router-dom";
// Styling
import "../../styling/admin/adminSidebar.css";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li
          onClick={() => setActiveTab("verifications")}
          className={activeTab === "verifications" ? "active" : ""}
        >
          <i className="fa-solid fa-id-card"></i>
          Verification Requests
        </li>
        <li
          onClick={() => setActiveTab("users")}
          className={activeTab === "users" ? "active" : ""}
        >
          <i className="fa-solid fa-users"></i>
          Manage Users
        </li>
        <li
          onClick={() => navigate("/dashboard")}
          className="back-to-dashboard"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Back to Dashboard
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;

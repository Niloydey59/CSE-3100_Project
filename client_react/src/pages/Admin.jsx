import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { useAuth } from "../context/authcontext";
// Components
import AdminSidebar from "../components/admin/adminSidebar";
import VerificationRequests from "../components/admin/verificationRequests";
import Users from "../components/admin/users";
// Styling
import "../styling/admin/admin.css";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("verifications");

  // Redirect non-admin users
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "verifications":
        return <VerificationRequests />;
      case "users":
        return <Users />;
      default:
        return <div>Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-content">
        <h1>Admin Panel</h1>
        <div className="admin-overview">
          <p>
            Manage user verification requests and other administrative tasks.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Admin;

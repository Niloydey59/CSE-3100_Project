import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import "../styling/header.css";
import { useSidebar } from "../context/sidebarContext";

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { toggleSidebar } = useSidebar();

  const handleToggleNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
    if (currentUser) {
      console.log("Navigating to dashboard");
      setTimeout(() => navigate("/dashboard"), 0);
    } else {
      setTimeout(() => navigate("/login"), 0);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div>
      <section id="header">
        {/* Add left hamburger menu */}
        <div className="left-menu">
          <i
            className="fa-solid fa-bars"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          ></i>
        </div>

        <Link to="/" id="logo">
          <div>Stack RUET</div>
        </Link>

        <section id="left-section">
          <Link to="/" className="icon" title="Home">
            <i className="fa-solid fa-house"></i>
          </Link>
          <Link to="/groups" className="icon" title="Groups">
            <i className="fa-solid fa-users-line"></i>
          </Link>
        </section>

        <form id="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>

        <section id="right-section">
          {currentUser && (
            <>
              <Link to="/notifications" className="icon" title="Notifications">
                <i className="fa-solid fa-bell"></i>
              </Link>
              <Link to="/chat" className="icon" title="Chat">
                <i className="fa-solid fa-message"></i>
              </Link>
            </>
          )}
          <Link
            to="#"
            className="icon"
            onClick={handleProfileClick}
            title="Profile"
          >
            <i className="fa-solid fa-user"></i>
          </Link>
        </section>

        <section id="mobile">
          <i
            id="bar"
            className="fa-solid fa-bars"
            onClick={handleToggleNav}
          ></i>

          <div id="mobile-navbar" className={isMobileNavOpen ? "active" : ""}>
            <i
              id="close"
              className="fa-solid fa-xmark"
              onClick={handleToggleNav}
            ></i>
            <ul>
              <li>
                <Link to="/" className="icon" onClick={handleToggleNav}>
                  <i className="fa-solid fa-house"></i>
                </Link>
              </li>
              <li>
                <Link to="/groups" className="icon" onClick={handleToggleNav}>
                  <i className="fa-solid fa-users-line"></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/notifications"
                  className="icon"
                  onClick={handleToggleNav}
                >
                  <i className="fa-solid fa-bell"></i>
                </Link>
              </li>
              <li>
                <Link to="/chat" className="icon" onClick={handleToggleNav}>
                  <i className="fa-solid fa-message"></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="icon"
                  onClick={handleToggleNav}
                >
                  <i className="fa-solid fa-user"></i>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext"; // Import useAuth from context
import "../styling/header.css"; // Make sure this path is correct for your setup

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { currentUser } = useAuth(); // Get the currentUser from context
  const navigate = useNavigate(); // Use navigate to programmatically navigate

  const handleToggleNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
    if (currentUser) {
      console.log("User is logged in");
      setTimeout(() => navigate("/dashboard"), 0);
    } else {
      setTimeout(() => navigate("/login"), 0);
    }
  };

  return (
    <div>
      <section id="header">
        <Link to="/" id="logo">
          <div>Stack RUET</div>
        </Link>

        <section id="left-section">
          <Link to="/" className="icon">
            <i className="fa-solid fa-house"></i>
          </Link>
          <Link to="/groups" className="icon">
            <i className="fa-solid fa-users-line"></i>
          </Link>
        </section>

        <div id="search-bar">
          <select>
            <option value="all">All</option>
            <option value="posts">Posts</option>
            <option value="users">Users</option>
          </select>

          <input type="text" placeholder="Type here to Search" />
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <section id="right-section">
          <Link to="#" className="icon" onClick={handleProfileClick}>
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
                <Link to="/" className="icon">
                  <i className="fa-solid fa-house"></i>
                </Link>
              </li>
              <li>
                <Link to="#" className="icon">
                  <i className="fa-solid fa-users-line"></i>
                </Link>
              </li>
              <li>
                <Link to="#" className="icon">
                  <i className="fa-solid fa-message"></i>
                </Link>
              </li>
              <li>
                <Link to="/login" className="icon">
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

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import "../styling/header.css";

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

        <form id="search-bar" onSubmit={handleSearchSubmit}>
          <select>
            <option value="all">All</option>
            <option value="posts">Posts</option>
            <option value="users">Users</option>
          </select>

          <input
            type="text"
            placeholder="Type here to Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>

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
                <Link to="/groups" className="icon">
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

import React from "react";

// Context
import { useSidebar } from "../../context/sidebarContext";
// Styling
import "../../styling/home/sidebar.css";

const Sidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  return (
    <>
      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="close-button" onClick={toggleSidebar}>
          <i className="fa-solid fa-xmark"></i>
        </div>
        <div className="sidebar-section">
          <ul>
            <li>
              <i className="fa-solid fa-plus"></i> Newest
            </li>
            <li>
              <i className="fa-solid fa-fire-flame-curved"></i> Popular of the
              day
            </li>
            <li>
              <i className="fa-solid fa-person-walking"></i>Following
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h2>Popular Tags</h2>
          <ul>
            <li># javascript</li>
            <li># reactjs</li>
            <li># webdevelopment</li>
          </ul>
        </div>
      </aside>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Sidebar;

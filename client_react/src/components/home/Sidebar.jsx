import React from "react";

import "../../styling/home/sidebar.css";
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <ul>
          <li>
            <i class="fa-solid fa-plus"></i> Newest
          </li>
          <li>
            <i class="fa-solid fa-fire-flame-curved"></i> Popular of the day
          </li>
          <li>Following</li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h2>Popular Tags</h2>
        <ul>
          <li># javascript</li>
          <li># reactjs</li>
          <li># webdevelopment</li>
          {/* Add more tags */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;

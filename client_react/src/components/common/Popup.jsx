// src/components/common/Popup.jsx
import React from "react";
import { Link } from "react-router-dom";

//css imports
import "../../styling/popup.css";

const Popup = ({ isVisible, title, message, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>{title}</h2>
        <p>{message}</p>

        <div className="popup-actions">
          <Link to="/login" className="popup-button">
            Login Now
          </Link>

          <button className="popup-button close" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

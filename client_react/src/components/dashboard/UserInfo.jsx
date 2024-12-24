import React, { useState } from "react";

import { useAuth } from "../../context/authcontext";

// Styling
import "../../styling/dashboard/userInfo.css";
import { sendVerificationEmail, updatePassword } from "../../FetchApi";

const UserInfo = () => {
  const { currentUser } = useAuth();

  const [verificationMessage, setVerificationMessage] = useState("");
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      setVerificationMessage("Verification email sent successfully.");
    } catch (error) {
      setVerificationMessage(error.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(passwordForm);
      setPasswordUpdateMessage("Password updated successfully.");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordUpdateMessage(error.message);
    }
  };

  return (
    <div className="user-info">
      <h2>User Information</h2>

      {/* User Info */}
      <div className="info-section">
        <p>
          <strong>Name:</strong> {currentUser.username}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}{" "}
          <span
            className={`verification-status ${
              currentUser.isVerified ? "verified" : "not-verified"
            }`}
          >
            {currentUser.isVerified ? "Verified" : "Not Verified"}
          </span>
          {!currentUser.isVerified && (
            <button onClick={handleVerificationEmail} className="verify-btn">
              Verify Email
            </button>
          )}
        </p>
        {verificationMessage && (
          <p className="message">{verificationMessage}</p>
        )}
      </div>

      {/* Password Update Section */}
      <div className="password-section">
        <h3>Update Password</h3>
        <form onSubmit={handlePasswordUpdate}>
          <label>
            Current Password:
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  oldPassword: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          </label>
          <button type="submit" className="update-password-btn">
            Update Password
          </button>
        </form>
        {passwordUpdateMessage && (
          <p className="message">{passwordUpdateMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UserInfo;

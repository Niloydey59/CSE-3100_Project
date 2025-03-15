import React, { useState } from "react";
import { useAuth } from "../../context/authcontext";
import { sendVerificationEmail, updatePassword } from "../../FetchApi";
import "../../styling/dashboard/userInfo.css";

const UserInfo = () => {
  const { currentUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState("");
  const [userForm, setUserForm] = useState({
    username: currentUser.username,
    bio: currentUser.bio || "",
    photoURL: currentUser.photoURL || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleVerificationEmail = async () => {
    try {
      const response = await sendVerificationEmail();
      if (response.success) {
        setVerificationMessage(
          "Verification email sent successfully! Please check your inbox."
        );
      } else {
        setVerificationMessage(
          "Failed to send verification email. Please try again."
        );
      }
    } catch (error) {
      setVerificationMessage(
        "An error occurred while sending verification email."
      );
      console.error("Verification email error:", error);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordUpdateMessage("New passwords don't match!");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordUpdateMessage("Password must be at least 6 characters long!");
      return;
    }

    try {
      console.log("id=", currentUser._id);
      const response = await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
        userId: currentUser._id,
      });

      if (response.success) {
        setPasswordUpdateMessage("Password updated successfully!");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
        setTimeout(() => setPasswordUpdateMessage(""), 5000);
      } else {
        setPasswordUpdateMessage(
          response.message || "Failed to update password."
        );
      }
    } catch (error) {
      setPasswordUpdateMessage(error.message || "Password update failed!");
      console.error("Password update error:", error);
    }
  };

  return (
    <div className="user-info">
      <div className="profile-header">
        <div className="profile-avatar">
          {userForm.photoURL ? (
            <img src={userForm.photoURL} alt={userForm.username} />
          ) : (
            <span>{userForm.username[0].toUpperCase()}</span>
          )}
          {editMode && (
            <button className="change-avatar-btn">
              <i className="fa-solid fa-camera"></i>
            </button>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name">
            {editMode ? (
              <input
                type="text"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
                className="edit-input"
              />
            ) : (
              <h2>{currentUser.username}</h2>
            )}
            <button
              className="edit-profile-btn"
              onClick={() => setEditMode(!editMode)}
            >
              <i className={`fa-solid ${editMode ? "fa-save" : "fa-edit"}`}></i>
              {editMode ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          {editMode ? (
            <textarea
              value={userForm.bio}
              onChange={(e) =>
                setUserForm({ ...userForm, bio: e.target.value })
              }
              placeholder="Write something about yourself..."
              className="bio-input"
            />
          ) : (
            <p className="user-bio">{userForm.bio || "No bio added yet."}</p>
          )}
        </div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <div className="card-header">
            <i className="fa-solid fa-lock"></i>
            <h3>Security</h3>
          </div>
          <div className="card-content">
            <div className="verification-section">
              <div className="verification-info">
                <p>{currentUser.email}</p>
                <span
                  className={`verification-status ${
                    currentUser.isVerified ? "verified" : "not-verified"
                  }`}
                >
                  {currentUser.isVerified ? (
                    <>
                      <i className="fa-solid fa-check-circle"></i> Verified
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-exclamation-circle"></i> Not
                      Verified
                    </>
                  )}
                </span>
              </div>
              {!currentUser.isVerified && (
                <div className="verify-email-container">
                  <button
                    onClick={handleVerificationEmail}
                    className="verify-btn"
                    disabled={verificationMessage.includes("sent successfully")}
                  >
                    <i className="fa-solid fa-paper-plane"></i> Send
                    Verification
                  </button>
                  {verificationMessage && (
                    <span
                      className={`verify-message ${
                        verificationMessage.includes("success")
                          ? "success"
                          : "error"
                      }`}
                    >
                      {verificationMessage}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="password-section">
              <button
                className="toggle-password-form"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Change Password
                <i
                  className={`fa-solid ${
                    showPasswordForm ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></i>
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordUpdate} className="password-form">
                  <div className="form-group">
                    <label>
                      <i className="fa-solid fa-key"></i>
                      Current Password
                    </label>
                    <div className="password-input-container">
                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            oldPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="toggle-visibility-btn"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                      >
                        <i
                          className={`fa-solid ${
                            showPasswords.oldPassword
                              ? "fa-eye-slash"
                              : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fa-solid fa-lock"></i>
                      New Password
                    </label>
                    <div className="password-input-container">
                      <input
                        type={showPasswords.newPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="toggle-visibility-btn"
                        onClick={() => togglePasswordVisibility("newPassword")}
                      >
                        <i
                          className={`fa-solid ${
                            showPasswords.newPassword
                              ? "fa-eye-slash"
                              : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>
                      <i className="fa-solid fa-check-double"></i>
                      Confirm Password
                    </label>
                    <div className="password-input-container">
                      <input
                        type={
                          showPasswords.confirmPassword ? "text" : "password"
                        }
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="toggle-visibility-btn"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      >
                        <i
                          className={`fa-solid ${
                            showPasswords.confirmPassword
                              ? "fa-eye-slash"
                              : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="update-password-btn">
                    <i className="fa-solid fa-key"></i> Update Password
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

import React, { useState } from "react";
import { useAuth } from "../../context/authcontext";
import {
  requestVerification,
  sendVerificationEmail,
  updatePassword,
} from "../../FetchApi";
import "../../styling/dashboard/userInfo.css";

const UserInfo = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState("");
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [userForm, setUserForm] = useState({
    username: user.username,
    bio: user.bio || "",
    photoURL: user.photoURL || "",
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
  // New state for verification form
  const [verificationForm, setVerificationForm] = useState({
    series: "",
    position: "",
    department: "",
    documents: null,
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
      console.log("id=", user._id);
      const response = await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
        userId: user._id,
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

  const handleVerificationFormChange = (e) => {
    const { name, value } = e.target;
    setVerificationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setVerificationForm((prev) => ({
      ...prev,
      documents: e.target.files,
    }));
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (verificationForm.series)
      formData.append("series", verificationForm.series);
    if (verificationForm.position)
      formData.append("position", verificationForm.position);
    if (verificationForm.department)
      formData.append("department", verificationForm.department);

    // Handle file uploads
    if (verificationForm.documents) {
      for (let i = 0; i < verificationForm.documents.length; i++) {
        formData.append("verificationProof", verificationForm.documents[i]);
      }
    }

    try {
      const response = await requestVerification(user._id, formData);

      if (response.success) {
        setVerificationSuccess(true);
        setVerificationForm({
          series: "",
          position: "",
          department: "",
          documents: null,
        });
        setTimeout(() => {
          setVerificationSuccess(false);
          setShowVerificationForm(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Verification submission error:", error);
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
              <h2>{user.username}</h2>
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
        <div className="info-card verification-card">
          <div className="card-header">
            <i className="fa-solid fa-id-badge"></i>
            <h3>University Verification</h3>
          </div>
          <div className="card-content">
            <div className="verification-status-summary">
              <div className="status-summary-item">
                <span className="status-label">Series:</span>
                <span
                  className={`status-value ${
                    user.series?.isApproved
                      ? "verified"
                      : user.series?.pendingApproval
                      ? "pending"
                      : "not-set"
                  }`}
                >
                  {user.series?.isApproved
                    ? "Verified"
                    : user.series?.pendingApproval
                    ? "Pending Approval"
                    : "Not Set"}
                </span>
              </div>

              <div className="status-summary-item">
                <span className="status-label">Department:</span>
                <span
                  className={`status-value ${
                    user.department?.isApproved
                      ? "verified"
                      : user.department?.pendingApproval
                      ? "pending"
                      : "not-set"
                  }`}
                >
                  {user.department?.isApproved
                    ? "Verified"
                    : user.department?.pendingApproval
                    ? "Pending Approval"
                    : "Not Set"}
                </span>
              </div>

              <div className="status-summary-item">
                <span className="status-label">Position:</span>
                <span
                  className={`status-value ${
                    user.position?.isApproved
                      ? "verified"
                      : user.position?.pendingApproval
                      ? "pending"
                      : "not-set"
                  }`}
                >
                  {user.position?.isApproved
                    ? "Verified"
                    : user.position?.pendingApproval
                    ? "Pending Approval"
                    : "Not Set"}
                </span>
              </div>
            </div>

            <button
              className="verify-status-btn"
              onClick={() => setShowVerificationForm(!showVerificationForm)}
            >
              <i className="fa-solid fa-id-card"></i>
              {showVerificationForm
                ? "Hide Verification Form"
                : "Request Verification"}
            </button>

            {showVerificationForm && (
              <div className="verification-form">
                {verificationSuccess ? (
                  <div className="verification-success">
                    <i className="fa-solid fa-check-circle"></i>
                    <p>Verification request submitted successfully!</p>
                    <p className="verification-note">
                      Your request will be reviewed by an administrator.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="verification-description">
                      Submit your university ID card or any official document to
                      verify your status
                    </p>
                    <form
                      onSubmit={handleVerificationSubmit}
                      className="verification-form-content"
                    >
                      <div className="form-group">
                        <label htmlFor="series">Series Year</label>
                        <input
                          type="number"
                          id="series"
                          name="series"
                          min="1960"
                          max={new Date().getFullYear()}
                          placeholder="Enter your series (e.g., 2020)"
                          value={verificationForm.series}
                          onChange={handleVerificationFormChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select
                          id="department"
                          name="department"
                          value={verificationForm.department}
                          onChange={handleVerificationFormChange}
                        >
                          <option value="">Select Department</option>
                          <option value="CSE">CSE</option>
                          <option value="EEE">EEE</option>
                          <option value="ME">ME</option>
                          <option value="CE">CE</option>
                          <option value="IPE">IPE</option>
                          <option value="GCE">GCE</option>
                          <option value="MTE">MTE</option>
                          <option value="ETE">ETE</option>
                          <option value="CFPE">CFPE</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="position">Position</label>
                        <select
                          id="position"
                          name="position"
                          value={verificationForm.position}
                          onChange={handleVerificationFormChange}
                        >
                          <option value="">Select Position</option>
                          <option value="student">Student</option>
                          <option value="professor">Professor</option>
                          <option value="associate_professor">
                            Associate Professor
                          </option>
                          <option value="assistant_professor">
                            Assistant Professor
                          </option>
                          <option value="lecturer">Lecturer</option>
                          <option value="lab_assistant">Lab Assistant</option>
                          <option value="staff">Staff</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="document">
                          Upload Verification Document
                        </label>
                        <div className="file-input-container">
                          <input
                            type="file"
                            id="document"
                            name="document"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                          />
                          <div className="file-input-button">
                            <i className="fa-solid fa-upload"></i> Choose File
                          </div>
                          <span className="file-name">
                            {verificationForm.documents
                              ? `${verificationForm.documents.length} file(s) selected`
                              : "No file chosen"}
                          </span>
                        </div>
                        <p className="file-help-text">
                          Upload your university ID card or official document
                        </p>
                      </div>

                      <button type="submit" className="submit-verification-btn">
                        <i className="fa-solid fa-paper-plane"></i> Submit for
                        Verification
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <i className="fa-solid fa-lock"></i>
            <h3>Account Security</h3>
          </div>
          <div className="card-content">
            <div className="verification-section">
              <div className="verification-info">
                <p>{user.email}</p>
                <span
                  className={`verification-status ${
                    user.isVerified ? "verified" : "not-verified"
                  }`}
                >
                  {user.isVerified ? (
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
              {!user.isVerified && (
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
                  {/* Password form content */}
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

            {passwordUpdateMessage && (
              <div
                className={`message ${
                  passwordUpdateMessage.includes("successfully")
                    ? "success"
                    : "error"
                }`}
              >
                {passwordUpdateMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

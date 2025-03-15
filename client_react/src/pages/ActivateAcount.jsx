import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Api
import { verifyEmail } from "../FetchApi/user";
import { signOutUser } from "../FetchApi";
// Styles
import "../styling/activateAccount.css";

const ActivateAccount = () => {
  const { token } = useParams();
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await verifyEmail(token);
        setStatusMessage(response.message);
        setIsSuccess(true);
        signOutUser();
        setTimeout(() => navigate("/"), 3000);
      } catch (error) {
        setStatusMessage(error.response?.data?.message || "Activation failed.");
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    activateAccount();
  }, [token, navigate]);

  return (
    <div className="activate-container">
      <div className="activate-card">
        <div className="activate-content">
          <h2 className="activate-title">Account Activation</h2>
          {isLoading ? (
            <div className="loading-skeleton">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          ) : (
            <div className="status-container">
              <div
                className={`status-message ${isSuccess ? "success" : "error"}`}
              >
                {statusMessage}
              </div>
              {isSuccess && (
                <>
                  <div className="redirect-message">
                    You will be redirected to the login page shortly...
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar"></div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;

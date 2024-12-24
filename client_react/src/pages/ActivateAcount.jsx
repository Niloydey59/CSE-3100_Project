import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../FetchApi/user";
import { signOutUser } from "../FetchApi";

const ActivateAccount = () => {
  const { token } = useParams(); // Get the token from the URL
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await verifyEmail(token); // Call backend to verify the token
        setStatusMessage(response.message);
        signOutUser(); // Sign out the user
        setTimeout(() => navigate("/login"), 3000); // Redirect to home page after 3 seconds
      } catch (error) {
        setStatusMessage(error.response?.data?.message || "Activation failed.");
      }
    };
    activateAccount();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Account Activation</h2>
      <p>{statusMessage}</p>
      {statusMessage.includes("successfully") && (
        <p>You will be redirected to the login page shortly.</p>
      )}
    </div>
  );
};

export default ActivateAccount;

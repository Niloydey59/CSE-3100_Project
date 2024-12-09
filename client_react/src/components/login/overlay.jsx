import React from "react";

const Overlay = ({ isSignUpActive, togglePanel }) => {
  return (
    <div className="overlay-container">
      <div className="overlay">
        <div
          className={`overlay-panel overlay-left ${
            isSignUpActive ? "active" : ""
          }`}
        >
          <h1>Welcome Back!</h1>
          <p>Please login with your personal details</p>
          <button className="ghost" id="signIn" onClick={togglePanel}>
            Sign In
          </button>
        </div>
        <div
          className={`overlay-panel overlay-right ${
            isSignUpActive ? "active" : ""
          }`}
        >
          <h1>Hello, Friend!</h1>
          <p>Register your account </p>
          <button className="ghost" id="signUp" onClick={togglePanel}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;

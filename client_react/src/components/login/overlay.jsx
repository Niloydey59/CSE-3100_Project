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
          <p>Sign in to continue your journey with us</p>
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
          <p>
            Join our community and discover a world of opportunities and
            connections
          </p>
          <button className="ghost" id="signUp" onClick={togglePanel}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overlay;

import React, { useState } from "react";
import SignInForm from "../components/login/signInForm";
import SignUpForm from "../components/login/signUpForm";
import Overlay from "../components/login/overlay";
import "../styling/login/login.css";

const LoginPage = () => {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const togglePanel = () => setIsSignUpActive(!isSignUpActive);

  return (
    <main className="Main">
      <section className="login-section">
        <div
          className={`login-main ${isSignUpActive ? "right-panel-active" : ""}`}
        >
          {/* Sign-Up Form */}
          <div className="form-container sign-up-container">
            <SignUpForm />
          </div>

          {/* Sign-In Form */}
          <div className="form-container sign-in-container">
            <SignInForm />
          </div>

          {/* Overlay */}
          <Overlay isSignUpActive={isSignUpActive} togglePanel={togglePanel} />
        </div>
      </section>
    </main>
  );
};

export default LoginPage;

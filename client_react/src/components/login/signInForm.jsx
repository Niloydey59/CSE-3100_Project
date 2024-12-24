import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInUser } from "../../FetchApi";
import { useAuth } from "../../context/authcontext";

const SignInForm = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(""); // Clear general error on submit

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const user = { email, password };

    try {
      // Call the sign-in API
      const data = await login(user);
      console.log("User signed in successfully:", data);
      navigate("/");
    } catch (error) {
      console.error(error.message);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError("An error occurred during sign-in. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <span>Use your account credentials</span>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((prevErrors) => ({ ...prevErrors, email: "" })); // Clear email error
        }}
      />
      {errors.email && <p className="error">{errors.email}</p>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors((prevErrors) => ({ ...prevErrors, password: "" })); // Clear password error
        }}
      />
      {errors.password && <p className="error">{errors.password}</p>}
      {generalError && <p className="error">{generalError}</p>}

      <a href="#" id="fp">
        Forgot your password?
      </a>
      <button>Sign In</button>
    </form>
  );
};

export default SignInForm;

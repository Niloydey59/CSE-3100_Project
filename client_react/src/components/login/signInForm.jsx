import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Add this import

// API
import { signInUser } from "../../FetchApi";
// Context
import { useAuth } from "../../context/authcontext";

const SignInForm = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      if (data && data.success) {
        // Only navigate if login was successful
        console.log("User signed in successfully:", data);
        navigate("/");
      } else {
        setGeneralError(
          data.message || "Invalid credentials. Please try again."
        );
      }
    } catch (error) {
      console.error(error.message);
      setGeneralError(error.message);
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

      <div className="password-input-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
          }}
        />
        <button
          type="button"
          className="password-toggle-button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
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

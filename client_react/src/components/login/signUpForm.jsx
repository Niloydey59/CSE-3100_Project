import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../../FetchApi/index"; // Adjust the import path as needed

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = "Username is required";
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

    const user = { username, email, password };

    try {
      const data = await signUpUser(user);
      console.log("User registered successfully:", data);
      alert(data.message); // Show success message
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Error registering user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setGeneralError(error.response.data.message);
      } else {
        setGeneralError(
          "An error occurred during registration. Please try again."
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <span>Use your email for registration</span>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setErrors((prevErrors) => ({ ...prevErrors, username: "" })); // Clear username error
        }}
      />
      {errors.username && <p className="error">{errors.username}</p>}
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
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;

import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, signInUser, signOutUser } from "../FetchApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to decode JWT and set user
  const decodeAndSetUser = (token) => {
    try {
      console.log("Decoding token...");
      const decoded = jwtDecode(token);
      //console.log("Decoded token:", decoded);
      setUser(decoded.user);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      setUser(null);
      return null;
    }
  };

  // Fetch user data on app load (e.g., after a refresh or reopening the app)
  useEffect(() => {
    const getCurrentUser = async () => {
      setLoading(true);
      try {
        const response = await fetchCurrentUser(); // Fetch current user data from the backend
        console.log("Current user data:", response.payload.user);
        setUser(response.payload.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data", error);
        setUser(null);
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  // Login function called when user submits login form
  const login = async (credentials) => {
    try {
      const data = await signInUser(credentials); // Call the login API

      const { accessToken } = data.payload; // Get the access token from the response
      localStorage.setItem("accessToken", accessToken); // Store the token in local storage

      // Decode token and set user
      decodeAndSetUser(accessToken);

      console.log("Login successful and context set ", data.payload.user);

      navigate("/"); // Redirect to another page after login

      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Logout function to clear the context
  const logout = async () => {
    try {
      await signOutUser(); // Call the logout API
    } catch (error) {
      console.error("Logout failed:", error);
    }

    // Clear token and user regardless of API response
    await localStorage.removeItem("accessToken");
    setUser(null);

    // Redirect to another page after logout
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

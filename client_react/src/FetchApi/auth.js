import api from "./base";

// User sign-up API call
export const signUpUser = async (userData) => {
  try {
    const response = await api.post("/users/process-register", userData);
    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// User sign-in API call
export const signInUser = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    console.log("User signed in successfully:", response);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// User sign-out API call
export const signOutUser = async () => {
  try {
    const response = await api.get("/auth/logout");
    console.log("User signed out successfully:", response);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Fetch current logged-in user (for persistence across sessions)
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/auth/current-user"); // Your backend endpoint for fetching current user
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error; // Propagate the error if any
  }
};

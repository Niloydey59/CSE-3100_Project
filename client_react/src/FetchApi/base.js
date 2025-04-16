import axios from "axios";

const API_URL = "http://localhost:3001/api"; // Backend URL

const noInterceptorApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch {
    return true; // If there's an error, consider the token expired
  }
};

// Implement refresh function directly to avoid circular imports
const refreshTokenFunction = async () => {
  try {
    console.log("Refreshing token...");
    const response = await noInterceptorApi.post("/auth/refresh-token");
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// Add request interceptor to inject token dynamically
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");

  if (token) {
    if (isTokenExpired(token)) {
      console.log("Token expired");
      console.log("Interceptor calling refresh token function");
      const response = await refreshTokenFunction();
      token = response.payload.accessToken;
      await localStorage.setItem("accessToken", token);

      console.log("Token refreshed");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleApiError(error)); // Use handleApiError here
  }
);

// Error handler function
export const handleApiError = (error) => {
  if (error.response) {
    return {
      message: error.response.data.message || "Something went wrong.",
      status: error.response.status,
    };
  } else if (error.request) {
    return { message: "No response from server.", status: null };
  } else {
    return { message: error.message, status: null };
  }
};

export default api;

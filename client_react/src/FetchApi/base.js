import axios from "axios";

const API_URL = "http://localhost:3001/api"; // Backend URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to inject token dynamically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
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

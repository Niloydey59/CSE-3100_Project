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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's an expired token
      if (error.response.data.message === "Access Denied! Please login.") {
        alert("Session expired. Please log in again.");
        window.location.href = "/login"; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

// Create a new post API call
export const createPost = async (postData) => {
  try {
    const response = await api.post("/posts", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Post created:", response.data);
    return response.data; // { payload: { post: {} } }
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// post api call
export const fetchPosts = async ({ search = "", limit = 5, page = 1 }) => {
  try {
    const response = await api.get("/posts", {
      params: { search, limit, page },
    });
    console.log("Posts:", response.data);
    return response.data; // { payload: { posts: [] } }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Fetch details of a single post by ID
export const fetchPostDetails = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`); // Adjust the route as per your backend
    console.log("Post details:", response.data);
    return response.data; // { payload: { post: {} } }
  } catch (error) {
    console.error("Error fetching post details:", error);
    throw error;
  }
};

// User sign-up API call
export const signUpUser = async (userData) => {
  try {
    const response = await api.post("/users/process-register", userData);
    console.log("User registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
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
    console.error("Error signing in user:", error.response.data.message);
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
    console.error("Error signing out user:", error.response.data.message);
    throw error;
  }
};

// Fetch current logged-in user (for persistence across sessions)
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get("/auth/current-user"); // Your backend endpoint for fetching current user
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error.response.data.message);
    throw error; // Propagate the error if any
  }
};

// Post like API call
export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/like/${postId}`);
    console.log("Post liked:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Post dislike API call
export const dislikePost = async (postId) => {
  try {
    const response = await api.post(`/posts/dislike/${postId}`);
    console.log("Post disliked:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Get all groups API call
export const fetchGroups = async () => {
  try {
    const response = await api.get("/groups");
    console.log("Groups:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

// Get details of a single group by ID
export const fetchGroupDetails = async (groupId) => {
  try {
    console.log("Group ID:", groupId);
    const response = await api.get(`/groups/${groupId}`);
    console.log("Group details:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching group details:", error.response.data.message);
    throw error;
  }
};

export default api;

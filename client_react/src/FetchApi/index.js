import axios from "axios";
const API_URL = "http://localhost:3001/api"; // Backend URL

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// post api call
export const fetchPosts = async () => {
  try {
    const response = await api.get("/posts");
    console.log("Posts:", response.data);
    return response.data; // { payload: { posts: [] } }
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export default api;

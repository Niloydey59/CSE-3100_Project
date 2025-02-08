import api from "./base";

// Create a new post API call
export const createPost = async (postData) => {
  try {
    console.log("id:", postData.get("groupId"));
    const response = await api.post("/posts", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Post created:", response.data);
    return response.data; // { payload: { post: {} } }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// post api call
export const fetchPosts = async ({ search = "", limit = 5, page = 1 }) => {
  try {
    console.log("Search:", search);
    const response = await api.get("/posts", {
      params: { search, limit, page },
    });
    console.log("Posts:", response.data);
    return response.data; // { payload: { posts: [] } }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// get post by id api call
export const fetchPostsById = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    console.log("Posts:", response.data);
    return response.data; // { payload: { posts: [] } }
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
    throw error;
  }
};

// Update post by id api call
export const updatePostById = async (postId, postData) => {
  try {
    const response = await api.put(`/posts/${postId}`, postData);
    console.log("Post updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Delete post by id api call
export const deletePostById = async (postId) => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    console.log("Post deleted:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// Post like API call
export const likePost = async (postId) => {
  try {
    const response = await api.post(`/posts/like/${postId}`);
    console.log("Post liked:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
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
    console.error(error.message);
    throw error;
  }
};

// get posts by user id
export const fetchUserPosts = async () => {
  try {
    const response = await api.get("/posts/user");
    console.log("User posts:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

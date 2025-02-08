import api from "./base";

// get all comments
export const fetchComments = async (postId) => {
  try {
    const response = await api.get(`/comments/${postId}`);
    console.log("Comments:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

// add a comment
export const addComment = async (commentData, postId) => {
  try {
    console.log("Adding comment:", commentData);
    const response = await api.post(
      `/comments/add-comment/${postId}`,
      commentData
    );
    console.log("Added comment:", response.data);
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

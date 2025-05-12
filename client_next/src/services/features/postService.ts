import { GetPostsParams, PostsResponse } from "@/src/types/post.types";
import apiClient from "../api/apiClient";
import { handleApiError } from "../api/apiUtils";

/**
 * Get posts with optional pagination and filtering
 * @param params Query parameters for fetching posts
 * @returns Posts and pagination data
 */
export const getPosts = async (params?: GetPostsParams): Promise<PostsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    const queryString = queryParams.toString();
    const url = `/posts${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PostsResponse>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get a specific post by ID
 * @param postId The ID of the post to fetch
 * @returns Post data
 */
export const getPostById = async (postId: string) => {
  try {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Create a new post
 * @param postData FormData containing post details and images
 * @returns Created post data
 */
export const createPost = async (postData: FormData) => {
  try {
    const response = await apiClient.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Update an existing post
 * @param postId The ID of the post to update
 * @param updateData Data to update in the post
 * @returns Updated post data
 */
export const updatePost = async (postId: string, updateData: { title?: string; content?: string; tags?: string[] }) => {
  try {
    const response = await apiClient.put(`/posts/${postId}`, updateData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Delete a post
 * @param postId The ID of the post to delete
 * @returns Deleted post information
 */
export const deletePost = async (postId: string) => {
  try {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Like a post
 * @param postId The ID of the post to like
 * @returns Updated post data with new like count
 */
export const likePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/posts/like/${postId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Dislike a post
 * @param postId The ID of the post to dislike
 * @returns Updated post data with new dislike count
 */
export const dislikePost = async (postId: string) => {
  try {
    const response = await apiClient.post(`/posts/dislike/${postId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get posts by the current logged-in user
 * @param params Query parameters for pagination
 * @returns Posts created by the current user
 */
export const getUserPosts = async (params?: { page?: number; limit?: number }): Promise<PostsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/posts/user${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PostsResponse>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

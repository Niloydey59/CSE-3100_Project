import { GetPostsParams, PostsResponse } from "@/src/types/post.types";
import apiClient from "../api/apiClient";
import { handleApiError } from "../api/apiUtils";

export const postService = {
  /**
   * Get posts with optional pagination and filtering
   * @param params Query parameters for fetching posts
   * @returns Posts and pagination data
   */
  getPosts: async (params?: GetPostsParams): Promise<PostsResponse> => {
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
  },

  /**
   * Get a specific post by ID
   * @param postId The ID of the post to fetch
   * @returns Post data
   */
  getPostById: async (postId: string) => {
    try {
      const response = await apiClient.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Additional post-related methods will be added here
};

import { AddCommentRequest, CommentResponse, CommentsResponse, UpdateCommentRequest } from "@/src/types/comment.types";
import apiClient from "../api/apiClient";
import { handleApiError } from "../api/apiUtils";

/**
 * Add a new comment to a post
 * @param postId The ID of the post to comment on
 * @param commentData Content of the comment
 * @returns The created comment
 */
export const addComment = async (postId: string, commentData: AddCommentRequest): Promise<CommentResponse> => {
  try {
    const response = await apiClient.post(`/comments/add-comment/${postId}`, commentData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Get comments for a specific post with pagination
 * @param postId The ID of the post to get comments for
 * @param params Pagination parameters (page, limit)
 * @returns Comments and pagination data
 */
export const getComments = async (
  postId: string, 
  params?: { page?: number; limit?: number }
): Promise<CommentsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/comments/${postId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<CommentsResponse>(url);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Update a comment by ID
 * @param commentId The ID of the comment to update
 * @param updateData New content for the comment
 * @returns Updated comment data
 */
export const updateComment = async (commentId: string, updateData: UpdateCommentRequest): Promise<CommentResponse> => {
  try {
    const response = await apiClient.put(`/comments/${commentId}`, updateData);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Delete a comment by ID
 * @param commentId The ID of the comment to delete
 * @returns Deleted comment information
 */
export const deleteComment = async (commentId: string) => {
  try {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Like a comment
 * @param commentId The ID of the comment to like
 * @returns Updated comment data with new like count
 */
export const likeComment = async (commentId: string) => {
  try {
    const response = await apiClient.post(`/comments/like/${commentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Dislike a comment
 * @param commentId The ID of the comment to dislike
 * @returns Updated comment data with new dislike count
 */
export const dislikeComment = async (commentId: string) => {
  try {
    const response = await apiClient.post(`/comments/dislike/${commentId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

import { Author } from './post.types';

export interface Comment {
  _id: string;
  content: string;
  author: Author;
  postId: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface PaginationData {
  totalpages: number;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
}

export interface CommentsResponse {
  success: boolean;
  message: string;
  payload: {
    comments: Comment[];
    pagination: PaginationData;
  };
}

export interface CommentResponse {
  success: boolean;
  message: string;
  payload: Comment;
}

export interface AddCommentRequest {
  content: string;
}

export interface UpdateCommentRequest {
  content: string;
}

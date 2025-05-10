export interface Author {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  username: string;
  title: string;
  content: string;
  tags: string[];
  image: string[];
  author: Author | null;
  groupId: string | null;
  likes: string[];
  dislikes: string[];
  comments: string[];
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

export interface PostsResponse {
  success: boolean;
  message: string;
  payload: {
    posts: Post[];
    pagination: PaginationData;
  };
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  sort?: string;
  tags?: string[];
  search?: string;
}

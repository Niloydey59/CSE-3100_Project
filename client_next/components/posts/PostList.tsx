import React from "react";
import { Post } from "@/src/types/post.types";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  BookmarkPlus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ImageCarousel from "@/components/common/ImageCarousel";
import PostCard from "./PostCard";

interface PostListProps {
  posts: Post[];
  isUserDashboard?: boolean;
  onDelete?: (postId: string) => void;
  sortOrder?: "newest" | "oldest" | "popular";
  emptyStateComponent?: React.ReactNode;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  isUserDashboard = false,
  onDelete,
  sortOrder,
  emptyStateComponent,
}) => {
  if (posts.length === 0) {
    if (emptyStateComponent) {
      return emptyStateComponent;
    }
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
        <h3 className="font-medium text-lg mb-2">No posts found</h3>
        <p className="text-muted-foreground">Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div className={isUserDashboard ? "space-y-6" : "space-y-4"}>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          isUserDashboard={isUserDashboard}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;

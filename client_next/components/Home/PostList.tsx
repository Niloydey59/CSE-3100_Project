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

interface PostListProps {
  posts: Post[];
}

const PostList: React.FC<PostListProps> = ({ posts }) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
        <h3 className="font-medium text-lg mb-2">No posts found</h3>
        <p className="text-muted-foreground">Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  // Get first letter of username for avatar
  const avatarText = post.author?.username.charAt(0).toUpperCase() || "U";

  // Format content as preview (first 150 chars)
  const contentPreview =
    post.content.length > 150
      ? `${post.content.substring(0, 150)}...`
      : post.content;

  // Check if post has valid images
  const hasImages =
    post.image &&
    post.image.length > 0 &&
    post.image.some(
      (img) =>
        img &&
        img !== "path/to/postImage9.jpg" &&
        img !== "path/to/postImage10.jpg" &&
        img !== "path/to/postImage4.jpg" &&
        img !== "path/to/postImage5.jpg"
    );

  // Function to handle link navigation
  const handlePostClick = (e: React.MouseEvent) => {
    // Allow the link to navigate to post details
  };

  // Function to stop propagation for interactive elements
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <div className="bg-accent/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {avatarText}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {post.author?.username || "Unknown"}
          </span>
          <span className="text-xs text-muted-foreground">
            • {formatRelativeTime(post.createdAt)}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={stopPropagation}
        >
          <BookmarkPlus className="h-4 w-4" />
          <span className="sr-only">Save post</span>
        </Button>
      </div>

      <Link href={`/posts/${post._id}`} onClick={handlePostClick}>
        <div className="p-4 hover:bg-accent/10 transition-colors">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4">{contentPreview}</p>

          {/* Image Carousel - Only render if post has images */}
          {hasImages && (
            <div className="mb-4" onClick={stopPropagation}>
              <ImageCarousel
                images={post.image}
                postId={post._id}
                aspectRatio="video"
              />
            </div>
          )}

          {/* Tags - Now with stopPropagation to prevent navigation */}
          {post.tags.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-4"
              onClick={stopPropagation}
            >
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs hover:bg-secondary/80 cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="border-t bg-card px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1 text-muted-foreground text-sm"
            onClick={stopPropagation}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likes.length}</span>
          </div>

          <div
            className="flex items-center gap-1 text-muted-foreground text-sm"
            onClick={stopPropagation}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{post.dislikes.length}</span>
          </div>

          <div
            className="flex items-center gap-1 text-muted-foreground text-sm"
            onClick={stopPropagation}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length}</span>
          </div>
        </div>

        <Link href={`/posts/${post._id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
          >
            <span>Read More</span>
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PostList;

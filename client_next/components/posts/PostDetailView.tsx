import React from "react";
import { Post } from "@/src/types/post.types";
import { formatDate, formatRelativeTime } from "@/src/utils/dateUtils";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MessageSquare,
  User,
  Calendar,
  Tag as TagIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageCarousel from "@/components/common/ImageCarousel";
import PostActions from "./PostActions";

interface PostDetailViewProps {
  post: Post;
  onLike: () => void;
  onDislike: () => void;
  onSave: () => void;
  onShare: () => void;
}

const PostDetailView: React.FC<PostDetailViewProps> = ({
  post,
  onLike,
  onDislike,
  onSave,
  onShare,
}) => {
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

  return (
    <Card className="shadow-md border-2 overflow-hidden">
      {/* Post Header */}
      <div className="bg-accent/50 p-4 border-b">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author?.username
                  ? post.author.username.charAt(0).toUpperCase()
                  : post.username
                  ? post.username.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">
              {post.author?.username || post.username || "Unknown user"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span
              title={formatDate(post.createdAt, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            >
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Post Images - Show at the top if available */}
        {hasImages && (
          <div className="mb-6 border-b">
            <ImageCarousel
              images={post.image}
              postId={post._id}
              aspectRatio="video"
              fullWidth={true}
            />
          </div>
        )}

        {/* Post Content */}
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none leading-relaxed break-words whitespace-pre-line">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-2.5">
                <TagIcon className="h-5 w-5 text-muted-foreground" />
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="hover:bg-secondary/90 cursor-pointer text-xs px-2.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Post Stats and Actions */}
        <div className="border-t p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{post.likes.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ThumbsDown className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {post.dislikes.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {post.comments.length}
              </span>
            </div>
          </div>

          <PostActions
            onLike={onLike}
            onDislike={onDislike}
            onSave={onSave}
            onShare={onShare}
            isLiked={false} // This would come from the API
            isDisliked={false} // This would come from the API
            isSaved={false} // This would come from the API
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PostDetailView;

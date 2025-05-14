import React from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Tag as TagIcon,
  Edit,
  Trash2,
  ExternalLink,
  BookmarkPlus,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Post } from "@/src/types/post.types";
import ImageCarousel from "@/components/common/ImageCarousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PostCardProps {
  post: Post;
  isUserDashboard?: boolean;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isUserDashboard = false,
  onDelete,
}) => {
  // Format content as preview (first 150-200 chars based on context)
  const contentPreview =
    post.content.length > (isUserDashboard ? 200 : 150)
      ? `${post.content.substring(0, isUserDashboard ? 200 : 150)}...`
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

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Function to stop propagation for interactive elements
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    if (onDelete) {
      onDelete(post._id);
    }
  };

  // If in user dashboard, use the UserPostCard design
  if (isUserDashboard) {
    return (
      <Card className="overflow-hidden shadow-sm hover:shadow transition-shadow">
        <CardHeader className="bg-accent/10 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{post.title}</CardTitle>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">{contentPreview}</p>

          {/* Image Carousel - Only render if post has images */}
          {hasImages && (
            <div className="mb-4">
              <ImageCarousel
                images={post.image}
                postId={post._id}
                aspectRatio="video"
              />
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs hover:bg-secondary/80"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t bg-card px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes.length}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <ThumbsDown className="h-4 w-4" />
              <span>{post.dislikes.length}</span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/posts/${post._id}`}>
              <Button variant="ghost" size="sm" className="h-8">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>

            <Link href={`/user/posts/edit/${post._id}`}>
              <Button variant="outline" size="sm" className="h-8">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your post and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Default PostCard design for homepage
  return (
    <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-all overflow-hidden group">
      <div className="bg-accent/50 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {post.author?.username.charAt(0).toUpperCase() || "U"}
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

      <Link href={`/posts/${post._id}`} onClick={(e) => {}}>
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

export default PostCard;

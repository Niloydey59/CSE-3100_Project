import React from "react";
import { Post } from "@/src/types/post.types";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface UserPostListProps {
  posts: Post[];
  onDelete: (postId: string) => void;
  sortOrder: "newest" | "oldest" | "popular";
}

const UserPostList: React.FC<UserPostListProps> = ({
  posts,
  onDelete,
  sortOrder,
}) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
        <h3 className="font-medium text-lg mb-2">No posts found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't created any posts yet or none match your current filters.
        </p>
        <Link href="/user/posts/new">
          <Button>Create your first post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <UserPostCard key={post._id} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
};

const UserPostCard: React.FC<{
  post: Post;
  onDelete: (postId: string) => void;
}> = ({ post, onDelete }) => {
  // Format content as preview (first 200 chars)
  const contentPreview =
    post.content.length > 200
      ? `${post.content.substring(0, 200)}...`
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

  // Handle delete with confirmation
  const handleDelete = () => {
    onDelete(post._id);
  };

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
};

export default UserPostList;

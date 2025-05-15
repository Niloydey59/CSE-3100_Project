"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ThumbsUp,
  ThumbsDown,
  Edit2,
  Trash2,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Comment as CommentType } from "@/src/types/comment.types";
import { cn } from "@/lib/utils";
import { formatDateTimeAgo } from "@/src/utils/dateFormatter";
import {
  likeComment,
  dislikeComment,
} from "@/src/services/features/commentService";
import { useToast } from "@/hooks/use-toast";

interface CommentProps {
  comment: CommentType;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  currentUser?: string;
  isAuthenticated: boolean;
}

const Comment: React.FC<CommentProps> = ({
  comment: initialComment,
  onUpdate,
  onDelete,
  currentUser,
  isAuthenticated,
}) => {
  const [comment, setComment] = useState<CommentType>(initialComment);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialComment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDislikeLoading, setIsDislikeLoading] = useState(false);

  const isAuthor = currentUser === comment.author._id;
  const formattedDate = formatDateTimeAgo(comment.createdAt);
  const hasLiked = comment.likes.includes(currentUser || "");
  const hasDisliked = comment.dislikes.includes(currentUser || "");

  const { toast } = useToast();

  const handleSave = async () => {
    if (editedContent.trim() === "") return;
    setIsSubmitting(true);
    try {
      await onUpdate(editedContent);
      setComment((prev) => ({ ...prev, content: editedContent }));
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLikeLoading(true);

      // Optimistic update
      const wasLiked = comment.likes.includes(currentUser || "");
      const wasDisliked = comment.dislikes.includes(currentUser || "");

      // Create a copy of the comment with updated like/dislike state
      const updatedComment = { ...comment };

      if (wasLiked) {
        // Remove the like
        updatedComment.likes = updatedComment.likes.filter(
          (id) => id !== currentUser
        );
      } else {
        // Add like and remove dislike if it exists
        updatedComment.likes = [...updatedComment.likes, currentUser || ""];
        if (wasDisliked) {
          updatedComment.dislikes = updatedComment.dislikes.filter(
            (id) => id !== currentUser
          );
        }
      }

      // Update UI immediately
      setComment(updatedComment);

      // Call API
      const response = await likeComment(comment._id);

      // Update comment state with the response from the server
      if (response.success && response.payload.updatedComment) {
        setComment(response.payload.updatedComment);
      }
    } catch (error) {
      // Revert to original state on error
      setComment(initialComment);
      toast({
        title: "Error",
        description: "Failed to like comment",
        variant: "destructive",
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to dislike comments",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDislikeLoading(true);

      // Optimistic update
      const wasLiked = comment.likes.includes(currentUser || "");
      const wasDisliked = comment.dislikes.includes(currentUser || "");

      // Create a copy of the comment with updated like/dislike state
      const updatedComment = { ...comment };

      if (wasDisliked) {
        // Remove the dislike
        updatedComment.dislikes = updatedComment.dislikes.filter(
          (id) => id !== currentUser
        );
      } else {
        // Add dislike and remove like if it exists
        updatedComment.dislikes = [
          ...updatedComment.dislikes,
          currentUser || "",
        ];
        if (wasLiked) {
          updatedComment.likes = updatedComment.likes.filter(
            (id) => id !== currentUser
          );
        }
      }

      // Update UI immediately
      setComment(updatedComment);

      // Call API
      const response = await dislikeComment(comment._id);
      // Update comment state with the response from the server
      if (response.success && response.payload.updatedComment) {
        setComment(response.payload.updatedComment);
      }
    } catch (error) {
      // Revert to original state on error
      setComment(initialComment);
      toast({
        title: "Error",
        description: "Failed to dislike comment",
        variant: "destructive",
      });
    } finally {
      setIsDislikeLoading(false);
    }
  };

  return (
    <div className="flex gap-3 p-4 rounded-lg border-2 hover:bg-component-hover transition-colors">
      <Avatar className="h-9 w-9 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary">
          {comment.author.username?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{comment.author.username}</p>
            <p className="text-sm text-muted-foreground">{formattedDate}</p>
          </div>
          {isAuthor && !isEditing && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={editedContent.trim() === "" || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-foreground">{comment.content}</p>
            <div className="flex gap-4 mt-3">
              <button
                onClick={handleLike}
                disabled={isLikeLoading || isDislikeLoading}
                className={cn(
                  "flex items-center gap-1 text-sm transition-all duration-200 rounded-full px-3 py-1",
                  hasLiked
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {isLikeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsUp
                    className={cn(
                      "h-4 w-4 transition-all",
                      hasLiked ? "fill-primary " : "hover:fill-primary/10"
                    )}
                  />
                )}
                <span>{comment.likes.length}</span>
              </button>
              <button
                onClick={handleDislike}
                disabled={isLikeLoading || isDislikeLoading}
                className={cn(
                  "flex items-center gap-1 text-sm transition-all duration-200 rounded-full px-3 py-1",
                  hasDisliked
                    ? "bg-destructive/20 text-destructive font-medium"
                    : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                )}
              >
                {isDislikeLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown
                    className={cn(
                      "h-4 w-4",
                      hasDisliked
                        ? "fill-destructive"
                        : "hover:fill-destructive/10"
                    )}
                  />
                )}
                <span>{comment.dislikes.length}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;

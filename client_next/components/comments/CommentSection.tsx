import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare, Loader2 } from "lucide-react";
import Comment from "./Comment";
import {
  addComment,
  getComments,
  deleteComment,
  updateComment,
} from "@/src/services/features/commentService";
import {
  Comment as CommentType,
  PaginationData,
} from "@/src/types/comment.types";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/src/store/authStore";

interface CommentSectionProps {
  postId: string;
  comments: string[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments: commentIds,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchComments();
  }, [postId, currentPage]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await getComments(postId, {
        page: currentPage,
        limit: 10,
      });
      if (response.success) {
        setComments(response.payload.comments);
        setPagination(response.payload.pagination);
        setError("");
      } else {
        setError("Failed to load comments");
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addComment(postId, { content: newComment });
      if (response.success) {
        setNewComment("");
        toast({
          title: "Success",
          description: "Comment posted successfully",
        });
        // Refresh comments to include the new one
        fetchComments();
      } else {
        toast({
          title: "Error",
          description: "Failed to post comment",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const response = await updateComment(commentId, { content });
      if (response.success) {
        toast({
          title: "Success",
          description: "Comment updated successfully",
        });
        // No need to refetch all comments, the Comment component handles its own update
        return response.success;
      } else {
        toast({
          title: "Error",
          description: "Failed to update comment",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
        // Still need to refetch after deletion to remove the comment from the list
        fetchComments();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete comment",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const loadNextPage = () => {
    if (pagination?.nextPage) {
      setCurrentPage(pagination.nextPage);
    }
  };

  const loadPreviousPage = () => {
    if (pagination?.previousPage) {
      setCurrentPage(pagination.previousPage);
    }
  };

  return (
    <Card className="shadow-sm border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({commentIds.length || 0})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Add new comment form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9 mt-1 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                {user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                className="min-h-[100px] resize-none mb-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : comments.length > 0 ? (
            <>
              {comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onUpdate={(content) =>
                    handleUpdateComment(comment._id, content)
                  }
                  onDelete={() => handleDeleteComment(comment._id)}
                  currentUser={user?._id}
                  isAuthenticated={isAuthenticated}
                />
              ))}

              {/* Pagination controls */}
              {pagination && (
                <div className="flex justify-between items-center mt-6">
                  <Button
                    variant="outline"
                    onClick={loadPreviousPage}
                    disabled={!pagination.previousPage}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {pagination.totalpages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={loadNextPage}
                    disabled={!pagination.nextPage}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, MessageSquare } from "lucide-react";
import Comment from "./Comment";

interface CommentSectionProps {
  postId: string;
  comments: string[];
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // This would be implemented with the API
    setIsSubmitting(true);
    setTimeout(() => {
      setNewComment("");
      setIsSubmitting(false);
    }, 500);
  };

  // Mock comments data (in a real app, this would come from the API)
  const mockComments = [
    {
      id: "1",
      author: {
        username: "user1",
        _id: "u1",
      },
      content: "This is a great post! Really helpful information.",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      likes: 5,
    },
    {
      id: "2",
      author: {
        username: "user2",
        _id: "u2",
      },
      content:
        "I have a question regarding this topic. Could you please elaborate more on the second point?",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likes: 2,
    },
    {
      id: "3",
      author: {
        username: "user3",
        _id: "u3",
      },
      content:
        "Thanks for sharing this. It helped me solve a similar problem I was facing.",
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      likes: 8,
    },
  ];

  return (
    <Card className="shadow-sm border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length || mockComments.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Add new comment form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9 mt-1 flex-shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary">
                U
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
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-4">
          {mockComments.length > 0 ? (
            mockComments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
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

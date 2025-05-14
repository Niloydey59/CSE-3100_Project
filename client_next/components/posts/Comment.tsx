import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Reply } from "lucide-react";
import { formatRelativeTime } from "@/src/utils/dateUtils";

interface CommentAuthor {
  _id: string;
  username: string;
}

interface CommentProps {
  comment: {
    id: string;
    author: CommentAuthor;
    content: string;
    createdAt: string;
    likes: number;
  };
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex gap-3 group">
      <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {comment.author.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="bg-accent/40 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{comment.author.username}</span>
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm whitespace-pre-line">{comment.content}</p>
        </div>

        {/* Comment actions */}
        <div className="flex items-center gap-4 pl-1 mt-1 text-xs text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs opacity-70 group-hover:opacity-100 hover:opacity-100"
          >
            <ThumbsUp className="h-3.5 w-3.5 mr-1" />
            Like ({comment.likes})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs opacity-70 group-hover:opacity-100 hover:opacity-100"
          >
            <Reply className="h-3.5 w-3.5 mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comment;

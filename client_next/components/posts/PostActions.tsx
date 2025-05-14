import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  onLike: () => void;
  onDislike: () => void;
  onSave: () => void;
  onShare: () => void;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  layout?: "row" | "compact";
}

const PostActions: React.FC<PostActionsProps> = ({
  onLike,
  onDislike,
  onSave,
  onShare,
  isLiked = false,
  isDisliked = false,
  isSaved = false,
  layout = "row",
}) => {
  const isCompact = layout === "compact";

  return (
    <div className={cn("flex items-center", isCompact ? "gap-1" : "gap-2")}>
      <Button
        variant={isLiked ? "default" : "ghost"}
        size={isCompact ? "sm" : "default"}
        onClick={onLike}
        className={cn(
          isLiked && "bg-primary/90 text-primary-foreground hover:bg-primary/80"
        )}
      >
        <ThumbsUp className={cn("mr-1", isCompact ? "h-4 w-4" : "h-5 w-5")} />
        {!isCompact && <span>Like</span>}
      </Button>

      <Button
        variant={isDisliked ? "default" : "ghost"}
        size={isCompact ? "sm" : "default"}
        onClick={onDislike}
        className={cn(
          isDisliked &&
            "bg-primary/90 text-primary-foreground hover:bg-primary/80"
        )}
      >
        <ThumbsDown className={cn("mr-1", isCompact ? "h-4 w-4" : "h-5 w-5")} />
        {!isCompact && <span>Dislike</span>}
      </Button>

      <Button
        variant={isSaved ? "default" : "ghost"}
        size={isCompact ? "sm" : "default"}
        onClick={onSave}
        className={cn(
          isSaved && "bg-primary/90 text-primary-foreground hover:bg-primary/80"
        )}
      >
        <Bookmark className={cn("mr-1", isCompact ? "h-4 w-4" : "h-5 w-5")} />
        {!isCompact && <span>Save</span>}
      </Button>

      <Button
        variant="ghost"
        size={isCompact ? "sm" : "default"}
        onClick={onShare}
      >
        <Share2 className={cn("mr-1", isCompact ? "h-4 w-4" : "h-5 w-5")} />
        {!isCompact && <span>Share</span>}
      </Button>
    </div>
  );
};

export default PostActions;

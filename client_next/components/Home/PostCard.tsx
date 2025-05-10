import React from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Tag as TagIcon,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Post } from "@/src/types/post.types";
import ImageCarousel from "@/components/common/ImageCarousel";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    _id,
    title,
    content,
    username,
    tags,
    image,
    likes,
    dislikes,
    comments,
    createdAt,
  } = post;

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Format the post date using our custom utility
  const formattedDate = formatRelativeTime(createdAt);

  // Truncate content if it's too long
  const truncateContent = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Check if post has valid images
  const hasImages =
    image &&
    image.length > 0 &&
    image.some(
      (img) =>
        img &&
        img !== "path/to/postImage9.jpg" &&
        img !== "path/to/postImage10.jpg" &&
        img !== "path/to/postImage4.jpg" &&
        img !== "path/to/postImage5.jpg"
    );

  // Function to stop propagation for interactive elements
  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card className="mb-4 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/post/${_id}`}>
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium line-clamp-1">{username}</p>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-3 line-clamp-3">
            {truncateContent(content)}
          </p>

          {/* Image Carousel - Prevent link propagation when clicking */}
          {hasImages && (
            <div className="mb-3" onClick={stopPropagation}>
              <ImageCarousel images={image} postId={_id} aspectRatio="video" />
            </div>
          )}

          {/* Tags - Now with stopPropagation to prevent navigation */}
          {tags && tags.length > 0 && (
            <div
              className="flex flex-wrap gap-1 mb-2"
              onClick={stopPropagation}
            >
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs cursor-pointer"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>

      <CardFooter className="px-4 py-2 bg-muted/20 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center" onClick={stopPropagation}>
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likes?.length || 0}</span>
          </div>
          <div className="flex items-center" onClick={stopPropagation}>
            <ThumbsDown className="h-4 w-4 mr-1" />
            <span>{dislikes?.length || 0}</span>
          </div>
        </div>
        <Link href={`/post/${_id}`} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{comments?.length || 0} comments</span>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

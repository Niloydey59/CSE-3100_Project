import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPosts } from "@/src/services/features/postService";
import { Post } from "@/src/types/post.types";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import { Badge } from "@/components/ui/badge";

interface RecommendedPostsProps {
  currentPostId: string;
  tags: string[];
  onHasPostsChange?: (hasPosts: boolean) => void;
}

const RecommendedPosts: React.FC<RecommendedPostsProps> = ({
  currentPostId,
  tags,
  onHasPostsChange,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        setIsLoading(true);
        // In a real app, you'd have an API endpoint to get recommended posts
        // Here we're just getting posts and filtering them client-side
        const response = await getPosts({ limit: 10 });

        if (response.success && response.payload.posts) {
          // Filter out the current post and keep only related posts (by tags)
          const filteredPosts = response.payload.posts
            .filter((post) => post._id !== currentPostId)
            .filter((post) => {
              // Check if post has any tags in common with the current post
              return post.tags.some((tag) => tags.includes(tag));
            })
            .slice(0, 5); // Only keep up to 5 posts

          setPosts(filteredPosts);

          // Let the parent component know whether we have posts to display
          if (onHasPostsChange) {
            onHasPostsChange(filteredPosts.length > 0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch recommended posts:", error);
        if (onHasPostsChange) {
          onHasPostsChange(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (tags.length > 0) {
      fetchRecommendedPosts();
    } else if (onHasPostsChange) {
      onHasPostsChange(false);
    }
  }, [currentPostId, tags, onHasPostsChange]);

  if (isLoading) {
    return (
      <Card className="shadow-sm border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Related Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show the card if there are no related posts
  }

  return (
    <Card className="shadow-sm border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Related Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              href={`/posts/${post._id}`}
              key={post._id}
              className="group block"
            >
              <div className="p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <h3 className="font-medium text-sm mb-1.5 group-hover:text-primary line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatRelativeTime(post.createdAt)}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {post.tags.slice(0, 3).map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs px-1.5 py-0 h-5"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedPosts;

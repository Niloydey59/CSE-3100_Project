import React, { useState, useEffect } from "react";
import { Post } from "@/src/types/post.types";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import { MessageSquare, ThumbsUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for recent posts
const MOCK_POSTS: Post[] = [
  {
    _id: "post1",
    title: "Understanding React Hooks",
    content:
      "React Hooks are a feature in React that allow you to use state and other React features without writing a class component...",
    tags: ["React", "JavaScript", "Web Development"],
    author: { _id: "mockUserId123", username: "johndoe" },
    image: [],
    likes: ["user1", "user2", "user3"],
    dislikes: [],
    comments: [{ _id: "comment1" }, { _id: "comment2" }],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "post2",
    title: "Optimizing Database Queries in NodeJS",
    content:
      "When working with databases in Node.js applications, optimizing your queries is crucial for performance...",
    tags: ["NodeJS", "Database", "Performance"],
    author: { _id: "mockUserId123", username: "johndoe" },
    image: [],
    likes: ["user1"],
    dislikes: ["user4"],
    comments: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
  },
];

interface RecentUserPostsProps {
  userId: string;
  limit?: number;
}

const RecentUserPosts: React.FC<RecentUserPostsProps> = ({
  userId,
  limit = 2,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch posts from an API
    // For now, we'll use mock data with a slight delay to simulate loading
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Filter posts by user ID and limit the number
        const userPosts = MOCK_POSTS.filter(
          (post) => post.author._id === userId
        ).slice(0, limit);
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="p-4 border rounded-md">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-3" />
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-10" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md border-dashed">
        <p className="text-muted-foreground">
          You haven't created any posts yet.
        </p>
        <Link href="/user/posts/new">
          <Button className="mt-3" size="sm">
            Create your first post
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post._id}
          className="p-4 border rounded-md hover:bg-accent/10 transition-colors"
        >
          <Link href={`/posts/${post._id}`}>
            <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {post.content}
          </p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
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

          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-3 text-muted-foreground">
              <span className="flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                {post.likes.length}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                {post.comments.length}
              </span>
              <span className="text-xs">
                {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            <div className="flex space-x-2">
              <Link href={`/user/posts/edit/${post._id}`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Edit
                </Button>
              </Link>
              <Link href={`/posts/${post._id}`}>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  View <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentUserPosts;

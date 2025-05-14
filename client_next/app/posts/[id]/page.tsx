"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById } from "@/src/services/features/postService";
import { Post } from "@/src/types/post.types";
import Navbar from "@/components/Navbar/Navbar";
import Loading from "@/components/Loading/Loading";
import ErrorPage from "@/components/Error/Error";
import PostDetailView from "@/components/posts/PostDetailView";
import RecommendedPosts from "@/components/posts/RecommendedPosts";
import CommentSection from "@/components/posts/CommentSection";
import { useToast } from "@/hooks/use-toast";

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRelatedPosts, setHasRelatedPosts] = useState<boolean>(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getPostById(postId);
        if (response.success && response.payload) {
          setPost(response.payload.post);
        } else {
          setError("Failed to load post. Please try again later.");
        }
      } catch (err) {
        console.error("Failed to fetch post:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleLike = () => {
    // This would be implemented with the API
    toast({
      title: "Success",
      description: "You liked this post!",
    });
  };

  const handleDislike = () => {
    // This would be implemented with the API
    toast({
      title: "Noted",
      description: "You disliked this post",
    });
  };

  const handleSave = () => {
    // This would be implemented with the API
    toast({
      title: "Saved",
      description: "Post has been saved to your bookmarks",
    });
  };

  const handleShare = () => {
    // Copy the current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Post link has been copied to clipboard",
    });
  };

  // Handle the callback from RecommendedPosts component to let us know if there are related posts
  const handleRelatedPostsStatus = (hasPosts: boolean) => {
    setHasRelatedPosts(hasPosts);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="navbar sticky top-0 z-50 w-full border-b shadow-sm">
          <Navbar />
        </div>
        <Loading />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-background">
        <div className="navbar sticky top-0 z-50 w-full border-b shadow-sm">
          <Navbar />
        </div>
        <ErrorPage message={error || "Post not found"} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pattern-bg">
      <div className="navbar sticky top-0 z-50 w-full border-b shadow-sm">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content - spans full width if no related posts */}
          <div
            className={`${
              hasRelatedPosts ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <PostDetailView
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
              onSave={handleSave}
              onShare={handleShare}
            />

            {/* Comments section */}
            <div className="mt-8">
              <CommentSection postId={post._id} comments={post.comments} />
            </div>
          </div>

          {/* Sidebar - only shown if there are related posts */}
          {hasRelatedPosts && (
            <div className="lg:col-span-4 space-y-6">
              <div className="sticky top-24">
                <RecommendedPosts
                  currentPostId={post._id}
                  tags={post.tags}
                  onHasPostsChange={handleRelatedPostsStatus}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

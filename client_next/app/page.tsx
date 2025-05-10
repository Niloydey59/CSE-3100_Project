"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import PostList from "@/components/home/PostList";
import Pagination from "@/components/common/Pagination";
import Sidebar from "@/components/home/Sidebar";
import CreatePostBanner from "@/components/home/CreatePostBanner";
import { postService } from "@/src/services/features/postService";
import { Post, PaginationData } from "@/src/types/post.types";
import Loading from "@/components/Loading/Loading";
import ErrorPage from "@/components/Error/Error";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    totalpages: 1,
    currentPage: 1,
    previousPage: null,
    nextPage: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await postService.getPosts({ page });
      setPosts(response.payload.posts);
      setPagination(response.payload.pagination);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (page: number) => {
    fetchPosts(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background pattern-bg">
      <div className="navbar sticky top-0 z-50 w-full border-b shadow-sm">
        <Navbar />
      </div>

      {error ? (
        <ErrorPage message={error} />
      ) : (
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6 relative">
            {/* Sidebar - only visible on desktop with independent scrolling */}
            <div className="hidden md:block md:w-1/4 lg:w-1/5 shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2 custom-scrollbar">
                <Sidebar />
              </div>
            </div>

            {/* Main content - with its own scrolling */}
            <div className="flex-1 py-2 overflow-y-auto">
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  {/* Post creation banner */}
                  <div className="elevated-component mb-6 shadow-sm">
                    <CreatePostBanner />
                  </div>

                  {/* PostList - transparent container with no distinct background */}
                  <div className="mb-6">
                    <PostList posts={posts} />
                  </div>

                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    className="mt-6 elevated-component p-2 shadow-sm"
                  />
                </>
              )}
            </div>

            {/* Mobile sidebar - shown at the bottom on small screens */}
            <div className="md:hidden mt-4 pb-8">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

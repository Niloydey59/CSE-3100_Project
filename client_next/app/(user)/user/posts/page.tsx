"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/src/types/post.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import Link from "next/link";
import PostList from "@/components/posts/PostList";
import UserPostFilters from "@/components/user/posts/UserPostFilters";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import { getUserPosts, deletePost } from "@/src/services/features/postService";

export default function UserPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "popular">(
    "newest"
  );
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getUserPosts({ page: 1, limit: 10 });
        setPosts(response.payload.posts);
        setFilteredPosts(response.payload.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your posts. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  useEffect(() => {
    // Apply filters and search
    let result = [...posts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply tab filter
    if (activeTab === "popular") {
      result = result.filter((post) => post.likes.length > 2); // Example threshold
    } else if (activeTab === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter((post) => new Date(post.createdAt) > oneWeekAgo);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortOrder === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortOrder === "popular") {
        return b.likes.length - a.likes.length;
      }
      return 0;
    });

    setFilteredPosts(result);
  }, [posts, searchQuery, activeTab, sortOrder]);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });

      // Update local state
      const updatedPosts = posts.filter((post) => post._id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the post. Please try again.",
      });
    }
  };

  const toggleSort = () => {
    if (sortOrder === "newest") setSortOrder("oldest");
    else if (sortOrder === "oldest") setSortOrder("popular");
    else setSortOrder("newest");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Custom empty state component for user dashboard
  const emptyStateComponent = (
    <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-dashed">
      <h3 className="font-medium text-lg mb-2">No posts found</h3>
      <p className="text-muted-foreground mb-4">
        You haven't created any posts yet or none match your current filters.
      </p>
      <Link href="/user/posts/new">
        <Button>Create your first post</Button>
      </Link>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your posts
          </p>
        </div>
        <Link href="/user/posts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={toggleFilters}>
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={toggleSort}>
            {sortOrder === "newest" && <SortDesc className="h-4 w-4" />}
            {sortOrder === "oldest" && <SortAsc className="h-4 w-4" />}
            {sortOrder === "popular" && <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {showFilters && <UserPostFilters />}

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <PostList
            posts={filteredPosts}
            isUserDashboard={true}
            onDelete={handleDeletePost}
            sortOrder={sortOrder}
            emptyStateComponent={emptyStateComponent}
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <PostList
            posts={filteredPosts}
            isUserDashboard={true}
            onDelete={handleDeletePost}
            sortOrder={sortOrder}
            emptyStateComponent={emptyStateComponent}
          />
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <PostList
            posts={filteredPosts}
            isUserDashboard={true}
            onDelete={handleDeletePost}
            sortOrder={sortOrder}
            emptyStateComponent={emptyStateComponent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

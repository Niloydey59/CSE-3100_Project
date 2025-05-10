"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/src/types/post.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import Link from "next/link";
import UserPostList from "@/components/user/posts/UserPostList";
import UserPostFilters from "@/components/user/posts/UserPostFilters";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";

// Mock data for posts
const MOCK_POSTS: Post[] = [
  {
    _id: "post1",
    title: "Understanding React Hooks",
    content:
      "React Hooks are a feature in React that allow you to use state and other React features without writing a class component. They're a way to reuse stateful logic without changing your component hierarchy.\n\nHooks were added to React in version 16.8, and they enable you to use state and other React features without writing class components. This means you can build your entire application with functional components and hooks.",
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
      "When working with databases in Node.js applications, optimizing your queries is crucial for performance. Here are some tips for optimization:\n\n1. Use indexing on frequently queried fields\n2. Limit the fields returned in your queries\n3. Use pagination to limit the number of results\n4. Avoid N+1 query problems by using proper joins\n5. Consider using query caching mechanisms",
    tags: ["NodeJS", "Database", "Performance"],
    author: { _id: "mockUserId123", username: "johndoe" },
    image: [],
    likes: ["user1"],
    dislikes: ["user4"],
    comments: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "post3",
    title: "Introduction to TypeScript: Why You Should Use It",
    content:
      "TypeScript is a strongly typed programming language that builds on JavaScript. It provides better tooling at any scale, bringing static typing to JavaScript.\n\nWith TypeScript, you can catch errors during development rather than at runtime, which leads to more robust code and better developer experience. It also provides excellent IDE support with features like autocompletion, type checking, and refactoring tools.",
    tags: ["TypeScript", "JavaScript", "Programming"],
    author: { _id: "mockUserId123", username: "johndoe" },
    image: ["/images/typescript-intro.jpg"],
    likes: ["user7", "user8", "user9", "user10"],
    dislikes: ["user11"],
    comments: [{ _id: "comment5" }, { _id: "comment6" }, { _id: "comment7" }],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "post4",
    title: "Building Responsive UIs with Tailwind CSS",
    content:
      "Tailwind CSS is a utility-first CSS framework that lets you build any design directly in your markup. It provides low-level utility classes that you can use to build completely custom designs without leaving your HTML.\n\nIn this post, I'll demonstrate how to create fully responsive designs using Tailwind's responsive utility classes. We'll cover breakpoints, responsive variants, and how to structure your components for different screen sizes.",
    tags: ["CSS", "TailwindCSS", "Web Design", "Responsive Design"],
    author: { _id: "mockUserId123", username: "johndoe" },
    image: ["/images/tailwind-responsive.jpg", "/images/tailwind-example.jpg"],
    likes: ["user12", "user13"],
    dislikes: [],
    comments: [{ _id: "comment8" }],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    updatedAt: new Date().toISOString(),
  },
];

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
    // In a real app, you would fetch posts from an API
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Filter by user ID (in a real app)
        setPosts(MOCK_POSTS);
        setFilteredPosts(MOCK_POSTS);
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

  const handleDeletePost = (postId: string) => {
    // In a real app, you would call an API to delete the post
    toast({
      title: "Post deleted",
      description: "Your post has been successfully deleted.",
    });

    // Update local state
    const updatedPosts = posts.filter((post) => post._id !== postId);
    setPosts(updatedPosts);
  };

  const toggleSort = () => {
    if (sortOrder === "newest") setSortOrder("oldest");
    else if (sortOrder === "oldest") setSortOrder("popular");
    else setSortOrder("newest");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

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
          <UserPostList
            posts={filteredPosts}
            onDelete={handleDeletePost}
            sortOrder={sortOrder}
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <UserPostList
            posts={filteredPosts}
            onDelete={handleDeletePost}
            sortOrder={sortOrder}
          />
        </TabsContent>

        <TabsContent value="popular" className="mt-0">
          <UserPostList
            posts={filteredPosts}
            onDelete={handleDeletePost}
            sortOrder={sortOrder}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

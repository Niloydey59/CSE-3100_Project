"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import UserDashboardSidebar from "@/components/user/UserDashboardSidebar";
import { userService } from "@/src/services/features/userService";
import { User } from "@/src/types/user.types";
import Loading from "@/components/Loading/Loading";
import ErrorPage from "@/components/Error/Error";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For now use a mock user ID - in a real app, this would come from auth context
        const userId = "68007b0f485e0a2e69295c2b"; // This should be replaced with actual authenticated user ID
        const response = await userService.getUserById(userId);
        setUser(response.payload.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to load user data. Please try again later.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user profile. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  if (loading) return <Loading />;
  if (error) return <ErrorPage message={error} />;

  const isMobileView = () => {
    return typeof window !== "undefined" && window.innerWidth < 768;
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="navbar sticky top-0 z-50 w-full border-b shadow-sm">
        <Navbar />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - only visible on desktop */}
          <div className="hidden md:block md:w-1/4 lg:w-1/5 shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2 custom-scrollbar">
              <UserDashboardSidebar user={user} activePath={pathname} />
            </div>
          </div>

          {/* Mobile sidebar - visible only at the top on small screens */}
          <div className="md:hidden mb-6">
            <UserDashboardSidebar user={user} activePath={pathname} />
          </div>

          {/* Main content */}
          <div className="flex-1">{user && children}</div>
        </div>
      </div>
    </main>
  );
}

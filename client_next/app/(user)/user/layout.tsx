"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import UserDashboardSidebar from "@/components/user/UserDashboardSidebar";
import { getCurrentUser, logout } from "@/src/services/features/authService";
import { User } from "@/src/types/user.types";
import Loading from "@/components/Loading/Loading";
import ErrorPage from "@/components/Error/Error";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { UserProvider } from "@/components/layout/UserContext";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use getCurrentUser from authService instead of getUserById
        const userData = await getCurrentUser();
        setUser(userData);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorPage message={error} />;

  return (
    <UserProvider value={{ user, loading, error }}>
      <main className="min-h-screen bg-background">
        <div className="navbar sticky top-0 z-50 w-full border-b shadow-sm">
          <Navbar />
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - only visible on desktop */}
            <div className="hidden md:block md:w-1/4 lg:w-1/5 shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
                <UserDashboardSidebar user={user} activePath={pathname} />

                {/* Logout button at the bottom of sidebar */}
                <Button
                  variant="destructive"
                  className="mt-8 w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile sidebar and logout button */}
            <div className="md:hidden mb-6">
              <UserDashboardSidebar user={user} activePath={pathname} />
              <Button
                variant="destructive"
                className="mt-4 w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Main content */}
            <div className="flex-1">{user && children}</div>
          </div>
        </div>
      </main>
    </UserProvider>
  );
}

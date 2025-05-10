"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  MessageCircle,
  Bell,
  User,
  MenuIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
import NavbarLogo from "./NavbarLogo";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    // Check authentication status immediately when component mounts
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // Check if user is logged in by looking for accessToken in localStorage
    const accessToken = localStorage.getItem("access_token");
    setIsLoggedIn(!!accessToken);
    setAuthChecked(true);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <NavbarLogo />
        </div>

        {/* Search Bar - centered */}
        <div className="hidden md:flex relative flex-1 max-w-md mx-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search StackRUET..."
            className="w-full pl-8 bg-muted/40 focus-visible:ring-primary"
          />
        </div>

        {/* Navigation Links - Desktop */}
        <div className="flex items-center">
          {authChecked && (
            <div className="hidden md:flex items-center">
              {/* Communities Icon moved here to be alongside other right-side icons */}
              <Link href="/communities">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Communities"
                  className="hover:bg-orange-100/50 dark:hover:bg-orange-500/10 mx-1"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </Link>

              {isLoggedIn ? (
                <>
                  <Link href="/messages">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Messages"
                      className="hover:bg-orange-100/50 dark:hover:bg-orange-500/10 mx-1"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/notifications">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Notifications"
                      className="hover:bg-orange-100/50 dark:hover:bg-orange-500/10 mx-1"
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/user">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Profile"
                      className="hover:bg-orange-100/50 dark:hover:bg-orange-500/10 mx-1"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="hover:bg-orange-100/50 dark:hover:bg-orange-500/10 mx-1"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/register" className="mx-1">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </div>
          )}

          <ThemeToggle className="mx-1" />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-orange-100/50 dark:hover:bg-orange-500/10 ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Search - visible below md breakpoint */}
      <div className="md:hidden p-2 border-t border-border/40">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search StackRUET..."
            className="w-full pl-8 bg-muted/40"
          />
        </div>
      </div>

      {/* Mobile Menu - Only pass isLoggedIn if authChecked is true */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={authChecked ? isLoggedIn : false}
      />
    </nav>
  );
};

export default Navbar;

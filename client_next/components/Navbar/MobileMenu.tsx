import React from "react";
import Link from "next/link";
import { Users, MessageCircle, Bell, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

const MobileMenu = ({ isOpen, onClose, isLoggedIn }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-8">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <nav className="flex flex-col gap-8">
          {/* Increased spacing between items */}
          <Link
            href="/communities"
            onClick={onClose}
            className="flex items-center gap-4 px-3 py-2 text-lg font-medium"
          >
            <Users className="h-5 w-5" />
            <span>Communities</span>
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/messages"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-lg font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Messages</span>
              </Link>

              <Link
                href="/notifications"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-lg font-medium"
              >
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </Link>

              <Link
                href="/user"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-lg font-medium"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="px-3 py-2 text-lg font-medium"
              >
                Log in
              </Link>

              <Link href="/register" onClick={onClose}>
                <Button className="w-full">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { User } from "@/src/types/user.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  FileText,
  Settings,
  ShieldCheck,
  Users,
  ChevronRight,
} from "lucide-react";

interface UserDashboardSidebarProps {
  user: User | null;
  activePath: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

const UserDashboardSidebar: React.FC<UserDashboardSidebarProps> = ({
  user,
  activePath,
}) => {
  if (!user) return null;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  const navItems: NavItem[] = [
    {
      name: "Overview",
      href: "/user",
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      name: "My Posts",
      href: "/user/posts",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      name: "My Groups",
      href: "/user/groups",
      icon: <Users className="h-4 w-4" />,
      badge:
        user.groups && user.groups.length > 0 ? (
          <Badge
            variant="outline"
            className="ml-auto rounded-full px-2.5 bg-primary/10 text-primary text-xs"
          >
            {user.groups.length}
          </Badge>
        ) : null,
    },
    {
      name: "Account Settings",
      href: "/user/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    {
      name: "Verification",
      href: "/user/verification",
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: user.isVerified ? (
        <Badge
          variant="outline"
          className="ml-auto bg-green-500/10 text-green-600 border-green-200 text-xs"
        >
          Verified
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="ml-auto bg-amber-500/10 text-amber-600 border-amber-200 text-xs"
        >
          Pending
        </Badge>
      ),
    },
  ];

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* User Profile Header */}
      <div className="bg-primary/5 p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-background">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">{user.username}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              (item.href === "/user" && activePath === "/user") ||
              (item.href !== "/user" && activePath.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="flex-1">{item.name}</span>
                {item.badge && item.badge}
                <ChevronRight
                  className={cn(
                    "h-4 w-4 ml-1 transition-transform",
                    isActive ? "rotate-90" : ""
                  )}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default UserDashboardSidebar;

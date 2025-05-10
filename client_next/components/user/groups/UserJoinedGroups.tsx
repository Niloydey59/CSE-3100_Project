import React from "react";
import { formatRelativeTime } from "@/src/utils/dateUtils";
import {
  Users,
  Shield,
  UserCog,
  User,
  LogOut,
  ChevronRight,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string | null;
  role: "admin" | "moderator" | "member";
  joinedAt: string;
  recentActivity: boolean;
}

interface UserJoinedGroupsProps {
  groups: Group[];
  onLeaveGroup: (groupId: string) => void;
}

const UserJoinedGroups: React.FC<UserJoinedGroupsProps> = ({
  groups,
  onLeaveGroup,
}) => {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12 border rounded-xl border-dashed">
        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg mb-2">No groups joined yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't joined any groups or none match your search.
        </p>
        <Link href="/groups">
          <Button>Discover Groups</Button>
        </Link>
      </div>
    );
  }

  const getRoleBadge = (role: Group["role"]) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-200">
            <Shield className="mr-1 h-3 w-3" />
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
            <UserCog className="mr-1 h-3 w-3" />
            Moderator
          </Badge>
        );
      default:
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <User className="mr-1 h-3 w-3" />
            Member
          </Badge>
        );
    }
  };

  const getGroupInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="bg-card rounded-lg border overflow-hidden transition-shadow hover:shadow-md"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                {group.image ? (
                  <AvatarImage src={group.image} alt={group.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getGroupInitials(group.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-1 text-lg">{group.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-xs text-muted-foreground">
                        {group.members} members
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • Joined {formatRelativeTime(group.joinedAt)}
                      </span>
                      {group.recentActivity && (
                        <Badge variant="outline" className="text-xs py-0 h-5">
                          Recent activity
                        </Badge>
                      )}
                    </div>
                  </div>

                  {getRoleBadge(group.role)}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {group.description}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t px-4 py-2 flex justify-between items-center bg-accent/10">
            <Link
              href={`/groups/${group.id}`}
              className="text-sm flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4 mr-1" />
              View Group
            </Link>

            <div className="flex gap-2">
              {group.role === "admin" && (
                <Link href={`/groups/${group.id}/manage`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                    Manage
                  </Button>
                </Link>
              )}

              {group.role === "admin" || group.role === "moderator" ? (
                <Link href={`/groups/${group.id}/settings`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Settings
                  </Button>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs">
                      Group Options
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/groups/${group.id}`}
                        className="cursor-pointer"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Group
                      </Link>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="text-red-600 focus:text-red-600"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Leave Group
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Leave Group</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to leave "{group.name}"? You
                            can rejoin later if you change your mind.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onLeaveGroup(group.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Leave Group
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserJoinedGroups;

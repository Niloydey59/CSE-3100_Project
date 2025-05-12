import React from "react";
import { User } from "@/src/types/user.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Building2,
  Clock,
  BookOpen,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserProfileOverviewProps {
  user: User;
}

const UserProfileOverview: React.FC<UserProfileOverviewProps> = ({ user }) => {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {getInitials(user.username)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold">{user.username}</h2>
        <p className="text-sm text-muted-foreground mb-2">{user.email}</p>

        {user.isVerified ? (
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Verified Account
          </Badge>
        ) : (
          <Link href="/user/verification">
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-200 cursor-pointer hover:bg-amber-500/20">
              Needs Verification
            </Badge>
          </Link>
        )}
      </div>

      {user.bio ? (
        <div className="pt-2 px-2">
          <p className="text-sm text-center">{user.bio}</p>
        </div>
      ) : (
        <div className="pt-2 px-2 flex justify-center">
          <Link href="/user/settings">
            <Button variant="ghost" size="sm" className="text-xs">
              Add a bio
            </Button>
          </Link>
        </div>
      )}

      <div className="border-t pt-4 mt-4">
        <ul className="space-y-3">
          {user.department?.value && (
            <li className="flex items-center text-sm">
              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Department:</span>
              <span
                className={`font-medium ${
                  !user.department.isApproved ? "text-muted-foreground" : ""
                }`}
              >
                {user.department.value}
                {!user.department.isApproved &&
                user.department.pendingApproval ? (
                  <Badge className="ml-2 text-xs bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">
                    Pending
                  </Badge>
                ) : !user.department.isApproved ? (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Not Verified
                  </Badge>
                ) : null}
              </span>
            </li>
          )}

          {user.position?.value && (
            <li className="flex items-center text-sm">
              <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Position:</span>
              <span
                className={`font-medium capitalize ${
                  !user.position.isApproved ? "text-muted-foreground" : ""
                }`}
              >
                {user.position.value.replace("_", " ")}
                {!user.position.isApproved && user.position.pendingApproval ? (
                  <Badge className="ml-2 text-xs bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">
                    Pending
                  </Badge>
                ) : !user.position.isApproved ? (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Not Verified
                  </Badge>
                ) : null}
              </span>
            </li>
          )}

          {user.series?.value && (
            <li className="flex items-center text-sm">
              <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Series:</span>
              <span
                className={`font-medium ${
                  !user.series.isApproved ? "text-muted-foreground" : ""
                }`}
              >
                {user.series.value}
                {!user.series.isApproved && user.series.pendingApproval ? (
                  <Badge className="ml-2 text-xs bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20">
                    Pending
                  </Badge>
                ) : !user.series.isApproved ? (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Not Verified
                  </Badge>
                ) : null}
              </span>
            </li>
          )}

          {user.groups && user.groups.length > 0 && (
            <li className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-2">Groups:</span>
              <span className="font-medium">{user.groups.length}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserProfileOverview;

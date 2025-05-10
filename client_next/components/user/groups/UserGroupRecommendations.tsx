import React from "react";
import { Users, UserPlus, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface RecommendedGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  image: string | null;
  commonMembers: number;
}

interface UserGroupRecommendationsProps {
  groups: RecommendedGroup[];
  onJoinGroup: (groupId: string) => void;
}

const UserGroupRecommendations: React.FC<UserGroupRecommendationsProps> = ({
  groups,
  onJoinGroup,
}) => {
  const getGroupInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (groups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended Groups</CardTitle>
          <CardDescription>
            We'll suggest groups based on your interests and connections
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-base mb-2">
            No recommendations available
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            We don't have any group recommendations for you right now.
          </p>
          <Link href="/groups">
            <Button variant="outline">Browse All Groups</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recommended Groups</CardTitle>
        <CardDescription>
          Groups you might be interested in based on your profile and
          connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-start gap-4 p-3 bg-accent/10 rounded-lg"
            >
              <Avatar className="h-12 w-12">
                {group.image ? (
                  <AvatarImage src={group.image} alt={group.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getGroupInitials(group.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-base">{group.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-muted-foreground">
                        {group.members} members
                      </span>
                      {group.commonMembers > 0 && (
                        <span className="text-xs text-primary">
                          • {group.commonMembers} connections in this group
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {group.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="h-8 whitespace-nowrap"
                  onClick={() => onJoinGroup(group.id)}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Join
                </Button>

                <Link href={`/groups/${group.id}`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2"
                    title="View group details"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/groups/discover">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Discover More Groups
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserGroupRecommendations;

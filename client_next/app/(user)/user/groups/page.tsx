"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/src/types/user.types";
import { getUserById } from "@/src/services/features/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading/Loading";
import { Search, Plus, Users, UsersRound, UserPlus } from "lucide-react";
import Link from "next/link";
import UserGroupList from "@/components/user/groups/UserGroupList";
import UserJoinedGroups from "@/components/user/groups/UserJoinedGroups";
import UserGroupRecommendations from "@/components/user/groups/UserGroupRecommendations";

// Mock data for user groups
const MOCK_GROUPS = [
  {
    id: "group1",
    name: "CSE Community",
    description:
      "A group for Computer Science & Engineering students and faculty",
    members: 156,
    image: "/images/cse-group.jpg",
    role: "member",
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // Joined 90 days ago
    recentActivity: true,
  },
  {
    id: "group2",
    name: "RUET Programming Club",
    description: "Official group for RUET Programming Club members",
    members: 87,
    image: "/images/programming-club.jpg",
    role: "admin",
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // Joined 180 days ago
    recentActivity: true,
  },
  {
    id: "group3",
    name: "Series 2019",
    description: "Group for students from Series 2019",
    members: 120,
    image: null,
    role: "moderator",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Joined 30 days ago
    recentActivity: false,
  },
];

// Mock data for recommended groups
const MOCK_RECOMMENDED_GROUPS = [
  {
    id: "rec1",
    name: "EEE Forum",
    description: "Discussion forum for Electrical & Electronic Engineering",
    members: 98,
    image: "/images/eee-forum.jpg",
    commonMembers: 5,
  },
  {
    id: "rec2",
    name: "RUET Alumni Network",
    description: "Connect with RUET graduates from all departments",
    members: 342,
    image: "/images/alumni.jpg",
    commonMembers: 12,
  },
  {
    id: "rec3",
    name: "Tech Enthusiasts",
    description: "For anyone interested in technology and innovation",
    members: 64,
    image: null,
    commonMembers: 3,
  },
];

export default function UserGroups() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("joined");
  const { toast } = useToast();

  const [joinedGroups, setJoinedGroups] = useState(MOCK_GROUPS);
  const [recommendedGroups, setRecommendedGroups] = useState(
    MOCK_RECOMMENDED_GROUPS
  );
  const [filteredGroups, setFilteredGroups] = useState(MOCK_GROUPS);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // For now use a mock user ID
        const userId = "68007b0f485e0a2e69295c2b";
        const response = await getUserById(userId);
        setUser(response.payload.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
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

  useEffect(() => {
    // Filter groups based on search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = joinedGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query)
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(joinedGroups);
    }
  }, [searchQuery, joinedGroups]);

  const handleLeaveGroup = (groupId: string) => {
    // In a real app, call API to leave the group
    toast({
      title: "Left group",
      description: "You have successfully left the group.",
    });

    // Update local state
    const updatedGroups = joinedGroups.filter((group) => group.id !== groupId);
    setJoinedGroups(updatedGroups);
  };

  const handleJoinGroup = (groupId: string) => {
    // In a real app, call API to join the group
    toast({
      title: "Joined group",
      description: "You have successfully joined the group.",
    });

    // Find the group in recommended groups
    const group = recommendedGroups.find((g) => g.id === groupId);
    if (!group) return;

    // Add to joined groups
    const newJoinedGroup = {
      id: group.id,
      name: group.name,
      description: group.description,
      members: group.members,
      image: group.image,
      role: "member",
      joinedAt: new Date().toISOString(),
      recentActivity: false,
    };

    setJoinedGroups((prev) => [...prev, newJoinedGroup]);

    // Remove from recommendations
    setRecommendedGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  if (loading) return <Loading />;
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Groups</h1>
          <p className="text-muted-foreground mt-1">
            Manage your group memberships and discover new communities
          </p>
        </div>
        <Link href="/groups/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Group
          </Button>
        </Link>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="joined">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Joined Groups</span>
            <span className="xs:hidden">Joined</span>
          </TabsTrigger>
          <TabsTrigger value="discover">
            <UserPlus className="mr-2 h-4 w-4" />
            <span className="hidden xs:inline">Discover Groups</span>
            <span className="xs:hidden">Discover</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="joined" className="mt-6 space-y-6">
          {/* Search and Filter */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Joined Groups List */}
          <UserJoinedGroups
            groups={filteredGroups}
            onLeaveGroup={handleLeaveGroup}
          />

          {/* Group Statistics */}
          {joinedGroups.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Group Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-center">
                  <div className="bg-muted/60 rounded-lg p-3">
                    <dt className="text-muted-foreground mb-1">Total Groups</dt>
                    <dd className="text-3xl font-bold text-primary">
                      {joinedGroups.length}
                    </dd>
                  </div>
                  <div className="bg-muted/60 rounded-lg p-3">
                    <dt className="text-muted-foreground mb-1">Admin In</dt>
                    <dd className="text-3xl font-bold text-primary">
                      {joinedGroups.filter((g) => g.role === "admin").length}
                    </dd>
                  </div>
                  <div className="bg-muted/60 rounded-lg p-3">
                    <dt className="text-muted-foreground mb-1">Moderator In</dt>
                    <dd className="text-3xl font-bold text-primary">
                      {
                        joinedGroups.filter((g) => g.role === "moderator")
                          .length
                      }
                    </dd>
                  </div>
                  <div className="bg-muted/60 rounded-lg p-3">
                    <dt className="text-muted-foreground mb-1">
                      Active Groups
                    </dt>
                    <dd className="text-3xl font-bold text-primary">
                      {joinedGroups.filter((g) => g.recentActivity).length}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="discover" className="mt-6 space-y-6">
          {/* Group Recommendations */}
          <UserGroupRecommendations
            groups={recommendedGroups}
            onJoinGroup={handleJoinGroup}
          />

          {/* Browse Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Browse Group Categories
              </CardTitle>
              <CardDescription>
                Explore groups by categories to find communities that match your
                interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  {
                    name: "Academic",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Programming",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Research",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Sports",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Cultural",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Alumni",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Department",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                  {
                    name: "Series",
                    icon: <UsersRound className="h-4 w-4 mr-2" />,
                  },
                ].map((category, index) => (
                  <Link
                    key={index}
                    href={`/groups/category/${category.name.toLowerCase()}`}
                    className="flex items-center p-3 rounded-md hover:bg-accent transition-colors border text-sm"
                  >
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

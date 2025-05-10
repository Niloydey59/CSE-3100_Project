import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Hash, ChevronRight, Users } from "lucide-react";
import Link from "next/link";

// This would normally come from an API
const POPULAR_TAGS = [
  { name: "programming", count: 230 },
  { name: "mathematics", count: 185 },
  { name: "electronics", count: 149 },
  { name: "mechanical", count: 112 },
  { name: "cse", count: 98 },
  { name: "ece", count: 76 },
];

const TRENDING_TOPICS = [
  {
    id: "1",
    title: "How to prepare for internships?",
    activity: "Hot • 24 comments today",
  },
  {
    id: "2",
    title: "Study resources for Machine Learning",
    activity: "Trending • 15 new comments",
  },
  {
    id: "3",
    title: "Campus interview experiences",
    activity: "Active • Updated 2h ago",
  },
  {
    id: "4",
    title: "Thesis topic suggestions",
    activity: "Popular • 42 responses",
  },
];

const COMMUNITIES = [
  { name: "CSE Club", members: 512 },
  { name: "RUET Hackers", members: 328 },
  { name: "ECE Society", members: 276 },
  { name: "MechE Forum", members: 247 },
];

const Sidebar: React.FC = () => {
  return (
    <div className="space-y-6 pr-2">
      {/* Trending Topics */}
      <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-bold">
            <TrendingUp className="mr-2 h-5 w-5 text-primary" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 pt-0">
          {TRENDING_TOPICS.map((topic) => (
            <Link
              href={`/posts/${topic.id}`}
              key={topic.id}
              className="flex items-start group"
            >
              <div className="flex-1">
                <h3 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {topic.activity}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all">
        <CardHeader className="bg-accent/30 pb-2">
          <CardTitle className="flex items-center text-lg font-bold">
            <Hash className="mr-2 h-5 w-5 text-primary" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <Badge
                key={tag.name}
                variant="secondary"
                className="px-2 py-1 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <span>{tag.name}</span>
                <span className="ml-1 text-xs opacity-70">{tag.count}</span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Communities */}
      <Card className="border-l-4 border-l-primary/80 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-lg font-bold">
            <Users className="mr-2 h-5 w-5 text-primary/80" />
            Communities
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 pt-2">
          {COMMUNITIES.map((community) => (
            <Link
              href={`/community/${community.name}`}
              key={community.name}
              className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 transition-colors group"
            >
              <span className="font-medium text-sm group-hover:text-primary transition-colors">
                {community.name}
              </span>
              <Badge variant="outline" className="text-xs">
                {community.members}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sidebar;

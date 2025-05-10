import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

// Mock tags for filter
const POPULAR_TAGS = [
  "React",
  "JavaScript",
  "NodeJS",
  "TypeScript",
  "CSS",
  "Web Development",
  "Database",
  "Performance",
];

const UserPostFilters = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Filters</h3>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select defaultValue="all-time">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This week</SelectItem>
                <SelectItem value="this-month">This month</SelectItem>
                <SelectItem value="this-year">This year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by tags</label>
            <div className="flex flex-wrap gap-1">
              {POPULAR_TAGS.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                >
                  {tag}
                </Badge>
              ))}
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
              >
                + More
              </Badge>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Post status</label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="with-comments" />
                <label
                  htmlFor="with-comments"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  With comments
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="with-likes" />
                <label
                  htmlFor="with-likes"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  With likes
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="with-images" />
                <label
                  htmlFor="with-images"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  With images
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPostFilters;

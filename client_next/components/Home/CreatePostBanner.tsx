import React from "react";
import { Button } from "@/components/ui/button";
import { PenLine, Plus, Image, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const CreatePostBanner: React.FC = () => {
  // This is a placeholder - we'll implement the actual link later
  const postCreationLink = "/create-post";

  return (
    <div className="relative mb-6 overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/5 opacity-50"></div>

      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary">
              U
            </AvatarFallback>
          </Avatar>

          <Link href={postCreationLink} className="flex-grow">
            <Button
              variant="outline"
              className="w-full justify-start text-left text-muted-foreground h-12 pl-4 border-dashed hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
            >
              <span>What's on your mind?</span>
            </Button>
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 justify-between">
          <Link
            href={`${postCreationLink}?type=text`}
            className="flex-grow sm:flex-grow-0"
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary"
            >
              <PenLine className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Write</span> Post
            </Button>
          </Link>

          <Link
            href={`${postCreationLink}?type=image`}
            className="flex-grow sm:flex-grow-0"
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary"
            >
              <Image className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Add</span> Image
            </Button>
          </Link>

          <Link
            href={`${postCreationLink}?type=tag`}
            className="flex-grow sm:flex-grow-0"
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary"
            >
              <Tag className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Add</span> Tags
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBanner;

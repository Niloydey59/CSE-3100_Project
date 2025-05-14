"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  CircleDot,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ImageViewer from "./ImageViewer";

interface ImageCarouselProps {
  images: string[];
  postId: string;
  aspectRatio?: "square" | "video" | "wide";
  className?: string;
  fullWidth?: boolean;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  postId,
  aspectRatio = "video",
  className,
  fullWidth = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  // No need to render anything if there are no valid images
  if (
    !images ||
    images.length === 0 ||
    (images.length === 1 &&
      (images[0] === "path/to/postImage9.jpg" ||
        images[0] === "path/to/postImage10.jpg" ||
        images[0] === "path/to/postImage4.jpg" ||
        images[0] === "path/to/postImage5.jpg" ||
        !images[0]))
  ) {
    return null;
  }

  // Filter out placeholder images
  const validImages = images.filter(
    (img) =>
      img !== "path/to/postImage9.jpg" &&
      img !== "path/to/postImage10.jpg" &&
      img !== "path/to/postImage4.jpg" &&
      img !== "path/to/postImage5.jpg" &&
      img
  );

  if (validImages.length === 0) return null;

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const openImageViewer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setViewerOpen(true);
  };

  // Define aspect ratio classes
  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-[16/9]",
    wide: "aspect-[21/9]",
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-md group",
          aspectRatioClasses[aspectRatio],
          className,
          fullWidth ? "w-full" : "max-w-3xl"
        )}
      >
        <div className="absolute inset-0">
          {validImages.map((src, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-300",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
              onClick={openImageViewer}
              style={{ cursor: "pointer" }}
            >
              <Image
                src={src}
                alt={`Post image ${index + 1}`}
                fill
                sizes={fullWidth ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
                className="object-cover"
                priority={index === currentIndex}
                // Fallback for image loading errors
                onError={(e) => {
                  // Set a placeholder or hide the image on error
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}
        </div>

        {validImages.length > 1 && (
          <>
            {/* Left and right navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity image-navigation z-10"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity image-navigation z-10"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>

            {/* Image indicator dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {validImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-white scale-110"
                      : "bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Expand button for fullscreen view */}
        <Button
          variant="ghost"
          size="icon"
          onClick={openImageViewer}
          className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity image-navigation z-10"
        >
          <Expand className="h-4 w-4" />
          <span className="sr-only">View full size</span>
        </Button>

        {/* Image counter for multiple images */}
        {validImages.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/30 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentIndex + 1}/{validImages.length}
          </div>
        )}
      </div>

      {/* Full screen image viewer */}
      <ImageViewer
        images={validImages}
        initialIndex={currentIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
};

export default ImageCarousel;

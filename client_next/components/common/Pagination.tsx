import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationData } from "@/src/types/post.types";

interface PaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  className = "",
}) => {
  const { currentPage, totalpages, previousPage, nextPage } = pagination;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers

    if (totalpages <= maxPagesToShow) {
      // If we have fewer pages than our max, show all of them
      for (let i = 1; i <= totalpages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise, show a subset focused around the current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalpages, startPage + maxPagesToShow - 1);

      // Adjust if we're too close to the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipses if needed
      if (startPage > 1) {
        pages.unshift(-1); // -1 represents "..."
        pages.unshift(1); // Always include page 1
      }

      if (endPage < totalpages) {
        pages.push(-2); // -2 represents "..." at the end
        pages.push(totalpages); // Always include last page
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex justify-center items-center space-x-1 py-4 ${className}`}
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        disabled={previousPage === null}
        onClick={() => previousPage !== null && onPageChange(previousPage)}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page < 0) {
          // Render ellipsis
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-muted-foreground"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8"
          >
            {page}
          </Button>
        );
      })}

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        disabled={nextPage === null}
        onClick={() => nextPage !== null && onPageChange(nextPage)}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </nav>
  );
};

export default Pagination;

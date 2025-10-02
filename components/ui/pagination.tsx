"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  totalItems: number;
  itemsPerPage: number;
  showingFrom: number;
  showingTo: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onNextPage,
  onPreviousPage,
  totalItems,
  itemsPerPage,
  showingFrom,
  showingTo,
}) => {
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5; // Number of page buttons to show directly

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > maxPagesToShow - 2) {
        pages.push("...");
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= maxPagesToShow - 2) {
        endPage = maxPagesToShow - 1;
      } else if (currentPage > totalPages - (maxPagesToShow - 2)) {
        startPage = totalPages - (maxPagesToShow - 2);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - (maxPagesToShow - 2)) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200" dir="rtl">
      {/* Pagination Info */}
      <div className="text-sm text-gray-600 text-center sm:text-right">
        عرض {showingFrom} إلى {showingTo} من أصل {totalItems} عقار
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 ${currentPage === page ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2 text-gray-500">
                {page}
              </span>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
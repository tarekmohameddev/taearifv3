import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export const Pagination = ({
  currentPage,
  lastPage,
  total,
  perPage,
  from,
  to,
  onPageChange,
  loading = false,
}: PaginationProps) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (lastPage <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let end = Math.min(lastPage, start + maxVisiblePages - 1);

      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Always show pagination, even if there's only one page
  // This helps users understand the pagination structure

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Results info */}
      <div className="text-sm text-muted-foreground">
        عرض {from} إلى {to} من {total} نتيجة
      </div>

      {/* Pagination controls - only show if there are multiple pages */}
      {lastPage > 1 ? (
        <div className="flex items-center space-x-2 space-x-reverse">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {pageNumbers.map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={loading}
              className="h-8 w-8 p-0"
            >
              {page}
            </Button>
          ))}

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(lastPage)}
            disabled={currentPage === lastPage || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">صفحة واحدة</div>
      )}
    </div>
  );
};

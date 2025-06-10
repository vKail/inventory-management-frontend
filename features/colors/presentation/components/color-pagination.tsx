"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";


// This component provides a pagination control for navigating through pages of colors.

interface ColorPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// This function generates an array of page numbers for pagination.
// It handles the logic for displaying ellipses ("...") when there are many pages.
function getPageNumbers(current: number, total: number): (number | string)[] {
    const delta = 2;
    const pages: (number | string)[] = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);

        if (current > delta + 2) {
            pages.push("...");
        }

        const start = Math.max(2, current - delta);
        const end = Math.min(total - 1, current + delta);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - delta - 1) {
            pages.push("...");
        }

        pages.push(total);
    }

    return pages;
}


// This component renders the pagination control with buttons for navigating between pages.
// It includes previous and next buttons, as well as individual page buttons.
export function ColorPagination({
    currentPage,
    totalPages,
    onPageChange,
}: ColorPaginationProps) {
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    // This function handles the click event for page buttons, calling the onPageChange prop with the selected page.
    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <span className="sr-only">Página anterior</span>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((page, idx) =>
                typeof page === "number" ? (
                    <Button
                        key={idx}
                        variant={page === currentPage ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ) : (
                    <span key={idx} className="px-2 text-sm text-muted-foreground">
                        {page}
                    </span>
                )
            )}

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <span className="sr-only">Página siguiente</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
} 
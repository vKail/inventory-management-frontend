"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UserPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i < totalPages && i > 1) {
            range.push(i);
        }
    }

    range.push(totalPages);

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
};

export function UserPagination({
    currentPage,
    totalPages,
    onPageChange,
}: UserPaginationProps) {
    const pageNumbers = getPageNumbers(currentPage, totalPages);

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
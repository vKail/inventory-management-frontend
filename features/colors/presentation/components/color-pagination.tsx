"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ColorPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// Función para calcular qué páginas mostrar
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

export function ColorPagination({
    currentPage,
    totalPages,
    onPageChange,
}: ColorPaginationProps) {
    const pageNumbers = getPageNumbers(currentPage, totalPages);

    return (
        <div className="flex items-center justify-center space-x-2">
            {/* Botón página anterior */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <span className="sr-only">Página anterior</span>
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Botones de página */}
            {pageNumbers.map((page, idx) =>
                typeof page === "number" ? (
                    <Button
                        key={idx}
                        variant={page === currentPage ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8 p-0 cursor-pointer"
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

            {/* Botón página siguiente */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 cursor-pointer"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <span className="sr-only">Página siguiente</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
} 
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MaterialPaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(current: number, total: number): (number | string)[] {
  const delta = 2;
  const pages: (number | string)[] = [];

  if (total <= 7) {
    // Mostrar todas las páginas
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Siempre mostrar la primera página
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

    // Siempre mostrar la última página
    pages.push(total);
  }

  return pages;
}

export function MaterialPaginator({
  currentPage,
  totalPages,
  onPageChange,
}: MaterialPaginatorProps) {
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

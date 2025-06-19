"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyLoanStateProps {
    message?: string;
    actionLabel?: string;
    actionPath?: string;
}

export function EmptyLoanState({
    message = "No hay préstamos actualmente",
    actionLabel = "Crear primer préstamo",
    actionPath = "/loans/new"
}: EmptyLoanStateProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center text-muted-foreground py-8">
            <p className="mb-4 text-lg">{message}</p>
            <Button
                onClick={() => router.push(actionPath)}
                variant="outline"
                size="sm"
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                {actionLabel}
            </Button>
        </div>
    );
} 
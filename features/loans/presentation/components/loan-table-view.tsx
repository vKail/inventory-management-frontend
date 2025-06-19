import { Loan } from "../../data/interfaces/loan.interface";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "../utils/date-formatter";
import { LoanStatus } from "../../data/interfaces/loan.interface";
import { useState } from "react";
import { LoanDetailsModal } from "./loan-details-modal";
import { LoanPagination } from "./loan-pagination";

interface LoanTableViewProps {
    loans: Loan[];
    onViewDetails: (loan: Loan) => void;
    onReturn: (loan: Loan) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const LOAN_STATUSES = {
    DELIVERED: { label: "Entregado", variant: "default", className: "bg-blue-400 hover:bg-blue-600" },
    RETURNED: { label: "Devuelto", variant: "success", className: "bg-green-400 hover:bg-green-600" },
    CANCELLED: { label: "Cancelado", variant: "destructive", className: "bg-red-400 hover:bg-red-600" },
    RETURNED_LATE: { label: "Devuelto Tardíamente", variant: "warning", className: "bg-yellow-400 hover:bg-yellow-600" }
} as const;

export function LoanTableView({
    loans,
    onReturn,
    currentPage,
    totalPages,
    onPageChange
}: LoanTableViewProps) {
    const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

    const getStatusBadge = (status: string) => {
        const config = LOAN_STATUSES[status as keyof typeof LOAN_STATUSES] || {
            label: status,
            variant: "default",
            className: "bg-gray-500 hover:bg-gray-600"
        };

        return (
            <Badge
                variant={config.variant as any}
                className={config.className}
            >
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <div className="w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Fecha de Inicio</TableHead>
                            <TableHead>Fecha de Vencimiento</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-32">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <p>No se encontraron préstamos</p>
                                        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            loans.map((loan) => (
                                <TableRow
                                    key={loan.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => setSelectedLoanId(loan.id)}
                                >
                                    <TableCell>Juan Pérez</TableCell>
                                    <TableCell>{formatDate(loan.requestDate)}</TableCell>
                                    <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                    <TableCell className="text-right">
                                        {loan.status === 'DELIVERED' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onReturn(loan);
                                                }}
                                            >
                                                Devolver
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {loans.length > 0 && (
                <div className="mt-4">
                    <LoanPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}

            <LoanDetailsModal
                isOpen={selectedLoanId !== null}
                onClose={() => setSelectedLoanId(null)}
                loanId={selectedLoanId || 0}
                onReturn={onReturn}
            />
        </>
    );
} 
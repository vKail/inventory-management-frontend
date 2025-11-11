import { Button } from "@/components/ui/button";
import { formatDate } from "../../data/utils/date-formatter";
import { Loan, LoanStatus } from "@/features/loans/data/interfaces/loan.interface";
import { useState } from "react";
import { LoanDetailsModal } from "./loan-details-modal";
import { EmptyLoanState } from "./empty-loan-state";

interface LoanListViewProps {
    loans: Loan[];
    onViewDetails: (loan: Loan) => void;
    onReturn: (loan: Loan) => void;
}

export function LoanListView({ loans, onViewDetails, onReturn }: LoanListViewProps) {
    const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

    const getStatusBadge = (status: LoanStatus) => {
        const statusConfig = {
            [LoanStatus.PENDING]: { label: "Pendiente", variant: "secondary" },
            [LoanStatus.APPROVED]: { label: "Aprobado", variant: "success" },
            [LoanStatus.REJECTED]: { label: "Rechazado", variant: "destructive" },
            [LoanStatus.DELIVERED]: { label: "Entregado", variant: "info" },
            [LoanStatus.RETURNED]: { label: "Devuelto", variant: "default" },
            [LoanStatus.OVERDUE]: { label: "Vencido", variant: "warning" },
        };

        const config = statusConfig[status] || { label: status, variant: "default" };
        return (
            <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs whitespace-nowrap ${config.variant === 'success' ? 'bg-green-100 text-green-800' :
                config.variant === 'destructive' ? 'bg-red-100 text-red-800' :
                    config.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        config.variant === 'info' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'}`}>
                {config.label}
            </span>
        );
    };

    return (
        <>
            <div className="space-y-3">
                {loans.length === 0 ? (
                    <EmptyLoanState />
                ) : (
                    loans.map((loan) => (
                        <div
                            key={loan.id}
                            className="bg-white p-3 sm:p-4 rounded-lg border shadow-sm cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => setSelectedLoanId(loan.id)}
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                        <p className="font-medium text-sm sm:text-base">Juan Pérez</p>
                                        <div className="sm:hidden">
                                            {getStatusBadge(loan.status)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            <span className="font-medium">Inicio:</span> {formatDate(loan.requestDate)}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            <span className="font-medium">Vencimiento:</span> {formatDate(loan.scheduledReturnDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-2">
                                    <div className="hidden sm:block">
                                        {getStatusBadge(loan.status)}
                                    </div>
                                    {loan.status === LoanStatus.DELIVERED && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-xs w-full sm:w-auto"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReturn(loan);
                                            }}
                                        >
                                            Devolver
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <LoanDetailsModal
                isOpen={selectedLoanId !== null}
                onClose={() => setSelectedLoanId(null)}
                loanId={selectedLoanId || 0}
                onReturn={onReturn}
            />
        </>
    );
} 
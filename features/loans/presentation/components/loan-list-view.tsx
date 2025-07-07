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
            <span className={`px-2 py-1 rounded-full text-xs ${config.variant === 'success' ? 'bg-green-100 text-green-800' :
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
            <div className="space-y-4">
                {loans.length === 0 ? (
                    <EmptyLoanState />
                ) : (
                    loans.map((loan) => (
                        <div
                            key={loan.id}
                            className="bg-white p-4 rounded-lg border shadow-sm cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedLoanId(loan.id)}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="font-medium">Juan Pérez</p>
                                        <div className="flex gap-4 mt-1">
                                            <p className="text-sm text-muted-foreground">
                                                Inicio: {formatDate(loan.requestDate)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Vencimiento: {formatDate(loan.scheduledReturnDate)}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(loan.status)}
                                </div>
                                {loan.status === LoanStatus.DELIVERED && (
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
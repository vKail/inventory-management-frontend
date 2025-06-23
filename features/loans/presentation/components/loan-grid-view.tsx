import { Button } from "@/components/ui/button";
import { formatDate } from "../../data/utils/date-formatter";
import { Loan, LoanStatus } from "@/features/loans/data/interfaces/loan.interface";
import { useState } from "react";
import { LoanDetailsModal } from "./loan-details-modal";

interface LoanGridViewProps {
    loans: Loan[];
    onViewDetails: (loan: Loan) => void;
    onReturn: (loan: Loan) => void;
}

export function LoanGridView({ loans, onViewDetails, onReturn }: LoanGridViewProps) {
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
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${config.variant === 'success' ? 'bg-green-100 text-green-800' :
                config.variant === 'destructive' ? 'bg-red-100 text-red-800' :
                    config.variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        config.variant === 'info' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                }`}>
                {config.label}
            </span>
        );
    };

    return (
        <>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loans.map((loan) => (
                    <div
                        key={loan.id}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedLoanId(loan.id)}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-medium">Juan Pérez</h3>
                                {getStatusBadge(loan.status)}
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-muted-foreground">Fecha de inicio:</span>
                                    <p className="text-sm font-medium">{formatDate(loan.requestDate)}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-muted-foreground">Fecha de vencimiento:</span>
                                    <p className={`text-sm font-medium ${loan.status === LoanStatus.OVERDUE ? 'text-red-600' : ''}`}>
                                        {formatDate(loan.scheduledReturnDate)}
                                    </p>
                                </div>
                            </div>
                            {loan.status === LoanStatus.DELIVERED && (
                                <div className="mt-4">
                                    <Button
                                        className="w-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onReturn(loan);
                                        }}
                                    >
                                        Devolver
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
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
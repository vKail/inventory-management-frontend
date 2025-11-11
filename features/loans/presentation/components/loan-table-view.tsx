import { Loan } from "@/features/loans/data/interfaces/loan.interface";
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
import { formatDate } from "../../data/utils/date-formatter";
import { useState, useEffect } from "react";
import { LoanDetailsModal } from "./loan-details-modal";
import { UserService } from "@/features/users/services/user.service";
import { EmptyLoanState } from "./empty-loan-state";

interface LoanTableViewProps {
    loans: Loan[];
    onViewDetails: (loan: Loan) => void;
    onReturn: (loan: Loan) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const LOAN_STATUSES = {
    DELIVERED: { label: "Entregado", variant: "default", className: "bg-blue-500 hover:bg-blue-600" },
    RETURNED: { label: "Devuelto", variant: "success", className: "bg-green-500 hover:bg-green-600" },
    CANCELLED: { label: "Cancelado", variant: "destructive", className: "bg-red-500 hover:bg-red-600" },
    RETURNED_LATE: { label: "Devuelto Tardíamente", variant: "warning", className: "bg-yellow-500 hover:bg-yellow-600" }
} as const;

export function LoanTableView({
    loans,
    onReturn,
    currentPage,
    totalPages,
    onPageChange
}: LoanTableViewProps) {
    const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
    const [requestorNames, setRequestorNames] = useState<Record<number, string>>({});
    const userService = UserService.getInstance();

    useEffect(() => {
        const fetchRequestorNames = async () => {
            const names: Record<number, string> = {};
            for (const loan of loans) {
                if (loan.requestorId) {
                    try {
                        const person = await userService.getPersonById(loan.requestorId.toString());
                        if (person) {
                            names[loan.id] = `${person.firstName} ${person.lastName}`;
                        } else {
                            names[loan.id] = 'Usuario no encontrado';
                        }
                    } catch (error) {
                        console.error('Error fetching person:', error);
                        names[loan.id] = 'Error al cargar';
                    }
                }
            }
            setRequestorNames(names);
        };
        fetchRequestorNames();
    }, [loans, userService]);

    const getStatusBadge = (status: string) => {
        const config = LOAN_STATUSES[status as keyof typeof LOAN_STATUSES] || {
            label: status,
            variant: "default",
            className: "bg-gray-500 hover:bg-gray-600"
        };

        return (
            <Badge
                variant={config.variant as any}
                className={`${config.className} text-[10px] sm:text-xs whitespace-nowrap`}
            >
                {config.label}
            </Badge>
        );
    };

    return (
        <>
            <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Solicitante</TableHead>
                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Fecha del Préstamo</TableHead>
                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Fecha de Vencimiento</TableHead>
                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Número de Items</TableHead>
                                    <TableHead className="text-xs sm:text-sm whitespace-nowrap">Estado</TableHead>
                                    <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-32">
                                            <EmptyLoanState />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    loans.map((loan) => (
                                        <TableRow
                                            key={loan.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => setSelectedLoanId(loan.id)}
                                        >
                                            <TableCell className="text-xs sm:text-sm whitespace-nowrap">{requestorNames[loan.id] || 'Cargando...'}</TableCell>
                                            <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatDate(loan.deliveryDate)}</TableCell>
                                            <TableCell className="text-xs sm:text-sm whitespace-nowrap">{formatDate(loan.scheduledReturnDate)}</TableCell>
                                            <TableCell className="text-xs sm:text-sm text-center">{loan.loanDetails?.length || 0}</TableCell>
                                            <TableCell className="text-xs sm:text-sm">{getStatusBadge(loan.status)}</TableCell>
                                            <TableCell className="text-right">
                                                {loan.status === 'DELIVERED' && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs"
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
                </div>
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
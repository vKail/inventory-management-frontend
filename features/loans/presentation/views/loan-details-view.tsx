"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoanStore } from "../../context/loan-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { LoanStatus } from "../../data/interfaces/loan.interface";

interface LoanDetailsViewProps {
    loanId: number;
}

export function LoanDetailsView({ loanId }: LoanDetailsViewProps) {
    const router = useRouter();
    const { selectedLoan, loading, error, getLoanById } = useLoanStore();

    useEffect(() => {
        getLoanById(loanId);
    }, [loanId, getLoanById]);

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
            <Badge variant={config.variant as any}>
                {config.label}
            </Badge>
        );
    };

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "Pendiente";
        const date = new Date(dateString);
        return isValid(date) ? format(date, "PPP", { locale: es }) : "Fecha inválida";
    };

    if (loading) {
        return <div>Cargando detalles del préstamo...</div>;
    }

    if (error || !selectedLoan) {
        return <div>Error: {error || "No se encontró el préstamo"}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Detalles del Préstamo</h1>
                <div className="space-x-2">
                    <Button variant="outline" onClick={() => router.back()}>
                        Volver
                    </Button>
                    {selectedLoan.status === LoanStatus.DELIVERED && (
                        <Button onClick={() => router.push(`/loans/${selectedLoan.id}/return`)}>
                            Registrar Devolución
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Información General</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Código</h3>
                                <p>{selectedLoan.loanCode}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Estado</h3>
                                <p>{getStatusBadge(selectedLoan.status)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Solicitante</h3>
                                <p>{selectedLoan.requestorId}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Aprobador</h3>
                                <p>{selectedLoan.approverId}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Fecha de Solicitud</h3>
                                <p>{formatDate(selectedLoan.requestDate)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Fecha de Aprobación</h3>
                                <p>{formatDate(selectedLoan.approvalDate)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Fecha de Entrega</h3>
                                <p>{formatDate(selectedLoan.deliveryDate)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Fecha de Devolución Programada</h3>
                                <p>{formatDate(selectedLoan.scheduledReturnDate)}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Fecha de Devolución Real</h3>
                                <p>{formatDate(selectedLoan.actualReturnDate)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Detalles Adicionales</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Motivo</h3>
                                <p>{selectedLoan.reason}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Evento Asociado</h3>
                                <p>{selectedLoan.associatedEvent || "N/A"}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Ubicación Externa</h3>
                                <p>{selectedLoan.externalLocation || "N/A"}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Notas</h3>
                                <p>{selectedLoan.notes || "N/A"}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Documento de Responsabilidad</h3>
                                <p>{selectedLoan.responsibilityDocument || "N/A"}</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-sm text-muted-foreground">Recordatorio Enviado</h3>
                                <p>{selectedLoan.reminderSent ? "Sí" : "No"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Items Prestados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {selectedLoan.loanDetails.map((detail, index) => (
                                <div key={index} className="p-4 border rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-medium text-sm text-muted-foreground">Item ID</h3>
                                            <p>{detail.itemId}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm text-muted-foreground">Condición de Salida</h3>
                                            <p>{detail.exitConditionId}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm text-muted-foreground">Observaciones de Salida</h3>
                                            <p>{detail.exitObservations || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Box, Copy, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loan, LoanStatus } from "@/features/loans/data/interfaces/loan.interface";
import { loanService } from "../../services/loan.service";
import { formatDate } from "../../data/utils/date-formatter";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/features/users/context/user-store";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { UserService } from "@/features/users/services/user.service";
import { useConditionStore } from "@/features/conditions/context/condition-store";

interface LoanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    loanId: number;
    onReturn?: (loan: Loan) => void;
}

export function LoanDetailsModal({ isOpen, onClose, loanId, onReturn }: LoanDetailsModalProps) {
    const [loan, setLoan] = useState<Loan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userDetails, setUserDetails] = useState<any>(null);
    const [approverDetails, setApproverDetails] = useState<any>(null);
    const [itemDetails, setItemDetails] = useState<Record<number, any>>({});
    const [conditionNames, setConditionNames] = useState<Record<string, string>>({});
    const { getUserById } = useUserStore();
    const { getInventoryItem } = useInventoryStore();
    const userService = UserService.getInstance();
    const { getConditionById } = useConditionStore();

    useEffect(() => {
        if (isOpen && loanId) {
            loadLoanDetails();
        }
    }, [isOpen, loanId]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (loan?.requestorId) {
                try {
                    const person = await userService.getPersonById(loan.requestorId.toString());

                    console.log(person);
                    if (person) {
                        setUserDetails(person);
                    } else {
                        // Fallback to user store if person not found
                        const user = await getUserById(loan.requestorId.toString());
                        setUserDetails(user);
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    setUserDetails(null);
                }
            }
        };
        fetchUserDetails();
    }, [loan?.requestorId, getUserById, userService]);

    useEffect(() => {
        const fetchApproverDetails = async () => {
            if (loan?.approverId) {
                try {
                    // Approver uses userId, so we use getUserById directly
                    const approver = await getUserById(loan.approverId.toString());
                    setApproverDetails(approver);
                } catch (error) {
                    console.error("Error fetching approver details:", error);
                    setApproverDetails(null);
                }
            }
        };
        fetchApproverDetails();
    }, [loan?.approverId, getUserById]);

    useEffect(() => {
        if (loan?.loanDetails) {
            const fetchItemDetails = async () => {
                const details: Record<number, any> = {};
                for (const detail of loan.loanDetails) {
                    const item = await getInventoryItem(detail.itemId.toString());
                    if (item) {
                        details[detail.itemId] = item;
                    }
                }
                setItemDetails(details);
            };
            fetchItemDetails();
        }
    }, [loan?.loanDetails, getInventoryItem]);

    useEffect(() => {
        const fetchConditionNames = async () => {
            if (loan?.loanDetails) {
                const conditionIds = new Set<string>();

                // Collect all condition IDs from loan details
                loan.loanDetails.forEach(detail => {
                    if (detail.exitConditionId) {
                        conditionIds.add(detail.exitConditionId.toString());
                    }
                    if (detail.returnConditionId) {
                        conditionIds.add(detail.returnConditionId.toString());
                    }
                });

                // Fetch condition names for all unique IDs
                const names: Record<string, string> = {};
                for (const conditionId of Array.from(conditionIds)) {
                    try {
                        const condition = await getConditionById(conditionId);
                        if (condition) {
                            names[conditionId] = condition.name;
                        }
                    } catch (error) {
                        console.error(`Error fetching condition ${conditionId}:`, error);
                        names[conditionId] = 'Condición no encontrada';
                    }
                }
                setConditionNames(names);
            }
        };
        fetchConditionNames();
    }, [loan?.loanDetails, getConditionById]);

    const loadLoanDetails = async () => {
        try {
            setLoading(true);
            const loanData = await loanService.getById(loanId);
            if (loanData) {
                setLoan(loanData);
            } else {
                setError("No se pudo cargar la información del préstamo");
            }
        } catch (error) {
            setError("Error al cargar los detalles del préstamo");
            console.error('Error loading loan details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!loan) return;

        const formattedLoan = {
            "Código": loan.loanCode,
            "Solicitante": loan.requestorId,
            "Fecha de Entrega": formatDate(loan.deliveryDate),
            "Fecha Programada de Devolución": formatDate(loan.scheduledReturnDate),
            "Fecha Real de Devolución": formatDate(loan.actualReturnDate),
            "Estado": loan.status,
            "Aprobador": loan.approverId,
            "Documento de Responsabilidad": loan.responsibilityDocument ? "Sí" : "No",
            "Recordatorio Enviado": loan.reminderSent ? "Sí" : "No"
        };

        const text = Object.entries(formattedLoan)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        navigator.clipboard.writeText(text);
        toast.success("Información copiada al portapapeles");
    };

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-[90vw] max-h-[80vh] overflow-y-auto">
                <DialogTitle className="text-lg font-semibold flex items-center justify-between border-b pb-3">
                    <span>Detalles del Préstamo #{loan?.loanCode}</span>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogTitle>

                {loading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center p-4">{error}</div>
                ) : loan ? (
                    <div className="space-y-4">
                        {/* Información del Préstamo */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Solicitante</p>
                                <p className="font-medium">
                                    {userDetails ?
                                        `${userDetails.firstName} ${userDetails.lastName}` :
                                        'Cargando...'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {userDetails?.type || 'Cargando...'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Estado</p>
                                <div className="mt-1">{getStatusBadge(loan.status)}</div>
                            </div>
                        </div>

                        {/* Fechas */}
                        <Card className="p-4">
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm">Fechas del Préstamo</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Entrega</p>
                                        <p className="font-medium">{formatDate(loan.deliveryDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Devolución Programada</p>
                                        <p className="font-medium">{formatDate(loan.scheduledReturnDate)}</p>
                                    </div>
                                    {loan.actualReturnDate && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Devolución Real</p>
                                            <p className="font-medium">{formatDate(loan.actualReturnDate)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Items Prestados */}
                        {loan.loanDetails && loan.loanDetails.length > 0 && (
                            <Card className="p-4">
                                <div className="space-y-4">
                                    <h3 className="font-medium text-sm">Items Prestados</h3>
                                    <div className="space-y-3">
                                        {loan.loanDetails.map((detail, index) => {
                                            const item = itemDetails[detail.itemId];
                                            const exitCondition = conditionNames[detail.exitConditionId?.toString() || ''];
                                            const returnCondition = detail.returnConditionId ?
                                                conditionNames[detail.returnConditionId?.toString() || ''] :
                                                null;
                                            return (
                                                <div key={index} className="bg-muted/50 p-3 rounded-md">
                                                    <div className="space-y-2">
                                                        <div>
                                                            <h4 className="font-medium text-sm">{item?.name || 'Cargando...'}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                Código: {item?.code || 'N/A'} | Identificador: {item?.identifier || 'N/A'}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                <span className="font-medium">Cantidad prestada:</span> {detail.quantity || 'N/A'}
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-2">
                                                            <div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    <span className="font-medium">Condición de salida:</span> {exitCondition || detail.exitConditionId}
                                                                </p>
                                                                {detail.exitObservations && (
                                                                    <p className="text-xs text-muted-foreground mt-1">
                                                                        <span className="font-medium">Observaciones de salida:</span> {detail.exitObservations}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Return Information - Only show if loan is returned */}
                                                            {loan.status === LoanStatus.RETURNED && returnCondition && (
                                                                <div className="pt-2 border-t border-border">
                                                                    <p className="text-xs text-green-700">
                                                                        <span className="font-medium">Condición de retorno:</span> {returnCondition}
                                                                    </p>
                                                                    {detail.returnObservations && (
                                                                        <p className="text-xs text-green-700 mt-1">
                                                                            <span className="font-medium">Observaciones de retorno:</span> {detail.returnObservations}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Detalles Adicionales */}
                        <Card className="p-4">
                            <div className="space-y-4">
                                <h3 className="font-medium text-sm">Detalles Adicionales</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Aprobador</p>
                                        <p className="font-medium">
                                            {approverDetails?.person ?
                                                `${approverDetails.person.firstName} ${approverDetails.person.lastName}` :
                                                'No asignado'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {approverDetails?.userType || ''}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Documento de Responsabilidad</p>
                                        <p className="font-medium">{loan.responsibilityDocument ? "Presentado" : "Pendiente"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Recordatorio</p>
                                        <p className="font-medium">{loan.reminderSent ? "Enviado" : "No enviado"}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Notas del Préstamo */}
                        {loan.notes && (
                            <Card className="p-4">
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm">Notas del Préstamo</h3>
                                    <p className="text-sm text-muted-foreground">{loan.notes}</p>
                                </div>
                            </Card>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                            </Button>
                            {loan.status === LoanStatus.DELIVERED && onReturn && (
                                <Button size="sm" onClick={() => onReturn(loan)}>
                                    Devolver
                                </Button>
                            )}
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    );
} 
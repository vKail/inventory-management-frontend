import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loan } from "@/features/loans/data/interfaces/loan.interface";
import { formatDate } from "../../data/utils/date-formatter";
import { LoanReturnFormValues, loanReturnSchema } from "../../data/schemas/loan-return.schema";
import { useUserStore } from "@/features/users/context/user-store";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { UserService } from "@/features/users/services/user.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConditionStore } from "@/features/conditions/context/condition-store";

interface LoanReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onSubmit: (data: LoanReturnFormValues) => Promise<void>;
}

export function LoanReturnModal({ isOpen, onClose, loan, onSubmit }: LoanReturnModalProps) {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [itemDetails, setItemDetails] = useState<Record<number, any>>({});
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const { getUserById } = useUserStore();
    const { getInventoryItem } = useInventoryStore();
    const userService = UserService.getInstance();
    const { conditions, getConditions } = useConditionStore();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (loan.requestorId) {
                try {
                    const person = await userService.getPersonById(loan.requestorId.toString());
                    if (person) {
                        setUserDetails(person);
                        console.log(person)
                    } else {
                        const user = await getUserById(loan.requestorId.toString());
                        setUserDetails(user);
                    }
                } catch (error) {
                    setUserDetails(null);
                }
            }
        };
        fetchUserDetails();
    }, [loan.requestorId, getUserById, userService]);

    useEffect(() => {
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
    }, [loan.loanDetails, getInventoryItem]);

    useEffect(() => {
        getConditions();
    }, [getConditions]);

    const form = useForm<LoanReturnFormValues>({
        resolver: zodResolver(loanReturnSchema),
        defaultValues: {
            loanId: loan.id,
            actualReturnDate: new Date().toISOString(),
            returnedItems: loan.loanDetails.map(detail => ({
                loanDetailId: detail.id,
                returnConditionId: 0,
                returnObservations: "",
                quantity: detail.quantity || 1
            })),
            notes: ""
        }
    });

    const handleNext = () => {
        if (currentItemIndex < loan.loanDetails.length - 1) {
            setCurrentItemIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentItemIndex > 0) {
            setCurrentItemIndex(prev => prev - 1);
        }
    };

    const validateCurrentItem = () => {
        const currentItem = form.getValues(`returnedItems.${currentItemIndex}`);
        if (!currentItem.returnConditionId) {
            toast.error("Debe seleccionar una condición para el item");
            return false;
        }
        if (!currentItem.returnObservations) {
            toast.error("Debe agregar observaciones para el item");
            return false;
        }
        return true;
    };

    const handleSubmit = async (data: LoanReturnFormValues) => {
        try {
            // Validate all items
            const allItemsValid = data.returnedItems.every((item, index) => {
                if (!item.returnConditionId) {
                    toast.error(`Debe seleccionar una condición para el item ${index + 1}`);
                    return false;
                }
                if (!item.returnObservations) {
                    toast.error(`Debe agregar observaciones para el item ${index + 1}`);
                    return false;
                }
                if (item.returnObservations.length > 250) {
                    toast.error(`Las observaciones del item ${index + 1} no pueden exceder 250 caracteres`);
                    return false;
                }
                return true;
            });

            if (!allItemsValid) return;

            // Validate notes length
            if (data.notes && data.notes.length > 250) {
                toast.error("Las notas no pueden exceder 250 caracteres");
                return;
            }

            await onSubmit(data);
            toast.success("Devolución registrada exitosamente");
            onClose();
        } catch (error) {
            console.error("Error submitting return:", error);
            toast.error("Error al registrar la devolución");
        }
    };

    const currentItem = loan.loanDetails[currentItemIndex];
    const item = itemDetails[currentItem?.itemId];
    const exitCondition = conditions.find(c => c.id === String(currentItem?.exitConditionId));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-[90vw] max-h-[85vh] overflow-y-auto">
                <DialogTitle className="text-lg font-semibold flex items-center justify-between border-b pb-3">
                    <span>Devolución de Préstamo # {loan.loanCode}</span>
                </DialogTitle>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                                <p className="text-muted-foreground">Fecha de Devolución</p>
                                <p className="font-medium">{formatDate(loan.scheduledReturnDate)}</p>
                            </div>
                        </div>

                        {/* Navigation Controls */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm">Items a Devolver</h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevious}
                                    disabled={currentItemIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                                    {currentItemIndex + 1} de {loan.loanDetails.length}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNext}
                                    disabled={currentItemIndex === loan.loanDetails.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Item Card */}
                        <Card className="p-4 max-h-[300px] overflow-y-auto">
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-sm">{item?.name || 'Cargando...'}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Código: {item?.code || 'N/A'} | Identificador: {item?.identifier || 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Cantidad prestada:</span> {currentItem?.quantity || 'N/A'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="font-medium">Condición de salida:</span> {exitCondition?.name || 'N/A'}
                                    </p>
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    Fueron prestados {currentItem?.quantity || 1} artículos de este item.
                                </div>
                                <FormField
                                    control={form.control}
                                    name={`returnedItems.${currentItemIndex}.quantity`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Cantidad a devolver</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Cantidad"
                                                    value={field.value || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Only allow numbers
                                                        if (value === '' || /^\d+$/.test(value)) {
                                                            const numValue = value === '' ? 0 : parseInt(value);
                                                            // Validate range
                                                            if (numValue >= 1 && numValue <= (currentItem?.quantity || 1)) {
                                                                field.onChange(numValue);
                                                            } else if (value === '') {
                                                                field.onChange(0);
                                                            }
                                                        }
                                                    }}
                                                    onBlur={(e) => {
                                                        // Ensure minimum value on blur
                                                        const value = parseInt(e.target.value) || 0;
                                                        if (value < 1) {
                                                            field.onChange(1);
                                                        } else if (value > (currentItem?.quantity || 1)) {
                                                            field.onChange(currentItem?.quantity || 1);
                                                        }
                                                    }}
                                                    className="w-24"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`returnedItems.${currentItemIndex}.returnConditionId`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Condición de Retorno</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(Number(value))}
                                                value={field.value ? field.value.toString() : ""}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-9">
                                                        <SelectValue placeholder="Seleccionar condición" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {conditions.map((condition) => (
                                                        <SelectItem
                                                            key={condition.id}
                                                            value={condition.id.toString()}
                                                        >
                                                            {condition.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`returnedItems.${currentItemIndex}.returnObservations`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm">Observaciones</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Observaciones sobre el estado del ítem"
                                                    className="h-16 resize-none"
                                                    maxLength={250}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-muted-foreground text-right">
                                                {field.value?.length || 0}/250
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>

                        {/* Notas de Devolución */}
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm">Notas de Devolución</h3>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Notas adicionales sobre la devolución (opcional)"
                                                className="h-16 resize-none"
                                                maxLength={250}
                                                {...field}
                                            />
                                        </FormControl>
                                        <div className="text-xs text-muted-foreground text-right">
                                            {field.value?.length || 0}/250
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" size="sm" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!form.formState.isValid}
                            >
                                Confirmar Devolución
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 
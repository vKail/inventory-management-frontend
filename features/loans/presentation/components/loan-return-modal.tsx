import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loan } from "../../data/interfaces/loan.interface";
import { formatDate } from "../utils/date-formatter";
import { LoanReturnFormValues, loanReturnSchema } from "../../data/schemas/loan-return.schema";
import { useUserStore } from "@/features/users/context/user-store";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { UserService } from "@/features/users/services/user.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface LoanReturnModalProps {
    isOpen: boolean;
    onClose: () => void;
    loan: Loan;
    onSubmit: (data: LoanReturnFormValues) => Promise<void>;
    conditions: Array<{ id: number; name: string; }>;
}

export function LoanReturnModal({ isOpen, onClose, loan, onSubmit, conditions }: LoanReturnModalProps) {
    const [userDetails, setUserDetails] = useState<any>(null);
    const [itemDetails, setItemDetails] = useState<Record<number, any>>({});
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const { getUserById } = useUserStore();
    const { getInventoryItem } = useInventoryStore();
    const userService = UserService.getInstance();

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (loan.requestorId) {
                try {
                    const person = await userService.getPersonByDni(loan.requestorId.toString());
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

    const form = useForm<LoanReturnFormValues>({
        resolver: zodResolver(loanReturnSchema),
        defaultValues: {
            loanId: loan.id,
            actualReturnDate: new Date().toISOString(),
            returnedItems: loan.loanDetails.map(detail => ({
                loanDetailId: detail.itemId,
                returnConditionId: 0,
                returnObservations: ""
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
                return true;
            });

            if (!allItemsValid) return;

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl w-[90vw] max-h-[80vh] overflow-y-auto">
                <DialogTitle className="text-lg font-semibold flex items-center justify-between border-b pb-3">
                    <span>Devolución de Préstamo #{loan.loanCode}</span>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
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

                        {/* Items a Devolver */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium text-sm">Items a Devolver</h3>
                                <p className="text-sm text-muted-foreground">
                                    Item {currentItemIndex + 1} de {loan.loanDetails.length}
                                </p>
                            </div>
                            <div className="relative">
                                <Card className="p-4">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium text-sm">{item?.name || 'Cargando...'}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                Código: {item?.code || 'N/A'} | Identificador: {item?.identifier || 'N/A'}
                                            </p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name={`returnedItems.${currentItemIndex}.returnConditionId`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm">Condición</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(Number(value))}
                                                        defaultValue={field.value.toString()}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-8">
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
                                                            className="h-20"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Card>
                                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handlePrevious}
                                        disabled={currentItemIndex === 0}
                                        className="bg-background/80 backdrop-blur-sm"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleNext}
                                        disabled={currentItemIndex === loan.loanDetails.length - 1}
                                        className="bg-background/80 backdrop-blur-sm"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

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
                                                className="h-20"
                                                {...field}
                                            />
                                        </FormControl>
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
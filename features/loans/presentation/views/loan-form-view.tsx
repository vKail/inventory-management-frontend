"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Handshake } from "lucide-react";
import { useConditionStore } from "@/features/conditions/context/condition-store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useState, useEffect } from "react";
import { LoanCreate as LoanCreateType } from "@/features/loans/data/interfaces/loan.interface";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { toast } from "sonner";
import { LoanScanModal } from "../components/loan-scan-modal";
import { UserService } from "@/features/users/services/user.service";
import RequestorSection from "../components/loan-form/RequestorSection";
import LoanInfoSection from "../components/loan-form/LoanInfoSection";
import LoanDetailsSection from "../components/loan-form/LoanDetailsSection";
import { loanService } from "../../services/loan.service";
import { inventoryService } from "@/features/inventory/services/inventory.service";
import { BlacklistDialog } from "../components/blacklist-dialog";
import { useLoanForm, RequestorInfo } from "../../hooks/use-loan-form";
import { useScannedItems } from "../../hooks/use-scanned-items";
import { calculateLoanDateLimits } from "../../data/utils/date-utils";

export function LoanFormView() {
    const router = useRouter();
    const { getConditions, conditions } = useConditionStore();
    const userService = UserService.getInstance();

    const [isValidated, setIsValidated] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
    const [pendingLoanData, setPendingLoanData] = useState<LoanCreateType | null>(null);
    const [requestorInfo, setRequestorInfo] = useState<RequestorInfo>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        type: "",
    });

    const userType = requestorInfo.type;
    const { form, formSchema } = useLoanForm(userType, false);
    const { minDate, maxDate } = calculateLoanDateLimits(userType, false);

    const {
        scannedItems,
        addScannedItem,
        removeScannedItem,
        updateItemObservations,
        updateItemCondition,
        updateItemQuantity,
        refreshItemsStock
    } = useScannedItems();

    useEffect(() => {
        form.setValue("requestorInfo", requestorInfo);
    }, [requestorInfo, form]);

    useEffect(() => {
        const loadConditions = async () => {
            try {
                await getConditions(1, 100);
            } catch (error) {
                console.error("Error loading conditions:", error);
            }
        };
        loadConditions();
    }, [getConditions]);

    const handleValidate = async () => {
        const requestorId = form.getValues("requestorId");
        if (!requestorId) {
            form.setError("requestorId", {
                type: "manual",
                message: "Por favor ingrese la cédula"
            });
            return;
        }

        try {
            const person = await userService.getPersonByDni(requestorId);
            if (person) {
                setRequestorInfo({
                    firstName: person.firstName,
                    lastName: person.lastName,
                    email: person.email,
                    phone: person.phone,
                    type: person.type
                });
                setIsValidated(true);
                form.clearErrors("requestorId");
                toast.success("Persona encontrada exitosamente");
            } else {
                form.setError("requestorId", {
                    type: "manual",
                    message: "No se encontró una persona con esta cédula"
                });
                setIsValidated(false);
            }
        } catch (error) {
            form.setError("requestorId", {
                type: "manual",
                message: "Error al validar la cédula"
            });
            setIsValidated(false);
        }
    };

    const handleScanComplete = async (item: InventoryItem | null) => {
        const loanDetail = await addScannedItem(item);
        if (loanDetail) {
            form.setValue("loanDetails", [...form.getValues("loanDetails"), loanDetail]);
        }
    };

    const handleRemoveItem = (code: string) => {
        removeScannedItem(code);
        const currentDetails = form.getValues("loanDetails");
        const itemToRemove = scannedItems.find(item => item.code === code);
        if (itemToRemove) {
            form.setValue("loanDetails", currentDetails.filter(detail => detail.itemId !== itemToRemove.id));
        }
    };

    const handleObservationsChange = (code: string, observations: string) => {
        updateItemObservations(code, observations);
        const currentDetails = form.getValues("loanDetails");
        const updatedDetails = currentDetails.map(detail => {
            const item = scannedItems.find(i => i.code === code);
            if (item && detail.itemId === item.id) { // Usar item.id en lugar de Number(item.code)
                return { ...detail, exitObservations: observations };
            }
            return detail;
        });
        form.setValue("loanDetails", updatedDetails);
    };

    const handleExitConditionChange = (itemCode: string, conditionId: string | number) => {
        updateItemCondition(itemCode, conditionId);
        const currentDetails = form.getValues("loanDetails");
        const item = scannedItems.find(i => i.code === itemCode);
        const updatedDetails = currentDetails.map(detail => {
            if (item && detail.itemId === item.id) { // Usar item.id en lugar de Number(item.code)
                return { ...detail, exitConditionId: Number(conditionId) };
            }
            return detail;
        });
        form.setValue("loanDetails", updatedDetails);
    };

    const handleQuantityChange = (itemCode: string, quantity: number) => {
        updateItemQuantity(itemCode, quantity);
        const currentDetails = form.getValues("loanDetails");
        const item = scannedItems.find(i => i.code === itemCode);
        const updatedDetails = currentDetails.map(detail => {
            if (item && detail.itemId === item.id) { // Usar item.id en lugar de Number(itemCode)
                return { ...detail, quantity };
            }
            return detail;
        });
        form.setValue("loanDetails", updatedDetails);
    };

    const isBlacklistError = (errorMessage: string): boolean => {
        const blacklistKeywords = ["lista negra", "blacklist", "no puede hacer préstamos", "morosos"];
        return blacklistKeywords.some(keyword => errorMessage.toLowerCase().includes(keyword));
    };

    const submitLoanWithBlacklistHandling = async (loanData: LoanCreateType) => {
        try {
            const response = await loanService.create(loanData);

            if (response.success) {
                toast.success("Préstamo creado exitosamente");
                router.push("/loans");
            } else {
                const errorMessage = response.message.content.join(' ');
                if (isBlacklistError(errorMessage)) {
                    setPendingLoanData(loanData);
                    setShowBlacklistDialog(true);
                } else {
                    toast.error(errorMessage);
                }
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message?.content?.join(' ') ||
                error?.response?.data?.message ||
                error?.message ||
                error?.toString() || '';

            if (isBlacklistError(errorMessage)) {
                setPendingLoanData(loanData);
                setShowBlacklistDialog(true);
            } else {
                toast.error("Error al crear el préstamo");
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = form.getValues();

            // Refresh stock of all items before validating
            const refreshedItems = await refreshItemsStock();

            // Validate using Zod
            const validationResult = formSchema.safeParse(formData);

            if (!validationResult.success) {
                const errors = validationResult.error.errors;
                errors.forEach(error => {
                    const fieldPath = error.path.join('.');
                    form.setError(fieldPath as any, {
                        type: "manual",
                        message: error.message
                    });
                });

                // Focus on the first error field
                const firstError = errors[0];
                if (firstError) {
                    const fieldPath = firstError.path.join('.');
                    const sectionMap: Record<string, string> = {
                        'requestorId': '[data-section="requestor"]',
                        'scheduledReturnDate': '[data-field="scheduledReturnDate"]',
                        'reason': '[data-field="reason"]',
                        'loanDetails': '[data-section="loan-details"]'
                    };

                    const selector = Object.keys(sectionMap).find(key => fieldPath.includes(key));
                    if (selector) {
                        const element = document.querySelector(sectionMap[selector]);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }

                toast.error("Por favor, complete todos los campos requeridos");
                return;
            }

            // Validate refreshed stock
            for (const item of refreshedItems) {
                if (item.quantity > item.stock) {
                    toast.error(`La cantidad del item "${item.name}" excede el stock disponible (${item.stock})`);
                    return;
                }
                if (item.quantity > 9999999) {
                    toast.error(`La cantidad del item "${item.name}" no puede exceder 9,999,999`);
                    return;
                }
            }

            // Update condition and stock for each item
            for (const item of refreshedItems) {
                const updateRes = await inventoryService.updateCondition(
                    item.id, // Usar el ID real del item
                    Number(item.exitConditionId),
                    item.stock
                );
                if (!updateRes.success) {
                    toast.error(`Error al actualizar la condición del item "${item.name}"`);
                    return;
                }
            }

            // Build loanDetails with selected condition and updated stock
            const loanDetails = refreshedItems.map(item => ({
                itemId: item.id, // Usar el ID real del item, no el code
                exitConditionId: Number(item.exitConditionId),
                exitObservations: item.exitObservations,
                quantity: item.quantity
            }));

            const loanCreate: LoanCreateType = {
                requestorId: formData.requestorId,
                scheduledReturnDate: format(formData.scheduledReturnDate, "yyyy-MM-dd'T'HH:mm"),
                reason: formData.reason,
                notes: formData.notes || "",
                blockBlackListed: true,
                loanDetails
            };

            await submitLoanWithBlacklistHandling(loanCreate);
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message?.content?.join(' ') ||
                error?.response?.data?.message ||
                error?.message ||
                '';
            toast.error(errorMessage || "Error al crear el préstamo");
        }
    };

    const handleBlacklistContinue = async () => {
        if (!pendingLoanData) return;

        try {
            const loanDataWithoutBlacklist = {
                ...pendingLoanData,
                blockBlackListed: false
            };

            const response = await loanService.create(loanDataWithoutBlacklist);

            if (response.success) {
                toast.success("Préstamo creado exitosamente");
                setShowBlacklistDialog(false);
                setPendingLoanData(null);
                router.push("/loans");
            } else {
                const errorMessage = response.message.content.join(' ');
                toast.error(errorMessage);
                setShowBlacklistDialog(false);
                setPendingLoanData(null);
            }
        } catch (error: any) {
            console.error("Error creating loan after blacklist confirmation:", error);
            toast.error("Error al crear el préstamo");
            setShowBlacklistDialog(false);
            setPendingLoanData(null);
        }
    };

    const handleBlacklistCancel = () => {
        setShowBlacklistDialog(false);
        setPendingLoanData(null);
    };

    return (
        <div className="w-full max-w-7xl mx-auto mb-6 px-2 sm:px-4 lg:px-6">
            <div className="mb-3 sm:mb-4">
                <Breadcrumb>
                    <BreadcrumbList className="flex-wrap">
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/operations" className="text-xs sm:text-sm">Operaciones</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/loans" className="flex items-center gap-1 text-xs sm:text-sm">
                                <Handshake className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                                Préstamos
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xs sm:text-sm">Nuevo</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <Form {...form}>
                <form className="space-y-3 sm:space-y-4">
                    <RequestorSection
                        form={form}
                        isValidated={isValidated}
                        requestorInfo={requestorInfo}
                        handleValidate={handleValidate}
                    />

                    <LoanInfoSection
                        form={form}
                        userType={userType}
                        allowLongLoan={false}
                        setAllowLongLoan={() => { }}
                        minDate={minDate}
                        maxDate={maxDate}
                    />

                    <LoanDetailsSection
                        scannedItems={scannedItems}
                        conditions={conditions}
                        setIsScanModalOpen={setIsScanModalOpen}
                        handleRemoveItem={handleRemoveItem}
                        handleExitConditionChange={handleExitConditionChange}
                        handleQuantityChange={handleQuantityChange}
                        handleObservationsChange={handleObservationsChange}
                    />

                    <FormField
                        control={form.control}
                        name="loanDetails"
                        render={() => (
                            <FormItem>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Card className="bg-muted/30">
                        <CardContent className="p-3">
                            <FormField
                                control={form.control}
                                name="blockBlackListed"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-0 leading-none">
                                            <FormLabel className="text-xs font-normal cursor-pointer">
                                                Acepto la responsabilidad por cualquier daño o pérdida del bien solicitado
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={handleSubmit}
                            disabled={form.formState.isSubmitting || !form.watch("blockBlackListed")}
                            className="w-full sm:w-auto"
                        >
                            {form.formState.isSubmitting ? "Creando..." : "Solicitar Préstamo"}
                        </Button>
                    </div>
                </form>
            </Form>

            <LoanScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
                onScanComplete={handleScanComplete}
            />

            <BlacklistDialog
                open={showBlacklistDialog}
                onContinue={handleBlacklistContinue}
                onCancel={handleBlacklistCancel}
            />
        </div>
    );
}
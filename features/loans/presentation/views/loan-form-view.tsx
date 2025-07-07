"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format, addHours, addWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Handshake, Plus } from "lucide-react";
import { useLoanStore } from "../../context/loan-store";
import { useConditionStore } from "@/features/conditions/context/condition-store";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { LoanCreate as LoanCreateType, LoanDetailCreate as LoanDetailType } from "@/features/loans/data/interfaces/loan.interface";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { toast } from "sonner";
import { LoanScanModal } from "../components/loan-scan-modal";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { UserService } from "@/features/users/services/user.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { loanService } from "../../services/loan.service";
import { inventoryService } from "@/features/inventory/services/inventory.service";

interface RequestorInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
}

interface LoanDetail {
    itemId: number;
    exitConditionId: number;
    exitObservations?: string;
}

interface ScannedItem {
    code: string;
    name: string;
    characteristics: string;
    image: string | null;
    exitObservations: string;
    conditionId?: string;
    exitConditionId?: string;
    quantity: number;
    stock: number;
}

export function LoanFormView() {
    const router = useRouter();
    const { createLoan } = useLoanStore();
    const { getInventoryItemByCode } = useInventoryStore();
    const { getConditionById, getConditions, conditions } = useConditionStore();
    const userService = UserService.getInstance();
    const [isValidated, setIsValidated] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
    const [conditionNames, setConditionNames] = useState<Record<string, string>>({});
    const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
    const [pendingLoanData, setPendingLoanData] = useState<LoanCreateType | null>(null);

    const [requestorInfo, setRequestorInfo] = useState<RequestorInfo>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        type: "",
    });

    const formSchema = z.object({
        requestorId: z.string().min(1, "La cédula es requerida"),
        scheduledReturnDate: z.date({
            required_error: "La fecha de devolución es requerida",
        }).refine(
            (date) => {
                const now = new Date();
                const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                const fourWeeksFromNow = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000);
                return date >= twoHoursFromNow && date <= fourWeeksFromNow;
            },
            {
                message: "La fecha de devolución debe ser mínimo 2 horas y máximo 4 semanas desde ahora"
            }
        ),
        reason: z.string().min(1, "El motivo es requerido").max(250, "El motivo no puede exceder 250 caracteres"),
        notes: z.string().max(250, "Las notas no pueden exceder 250 caracteres").optional(),
        requestorInfo: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
            phone: z.string().optional(),
            type: z.string().optional()
        }),
        blockBlackListed: z.boolean(),
        loanDetails: z.array(z.object({
            itemId: z.number(),
            exitConditionId: z.number(),
            exitObservations: z.string().max(250, "Las observaciones no pueden exceder 250 caracteres").optional(),
            quantity: z.number().min(1, "La cantidad debe ser mayor a 0")
        })).min(1, "Debe agregar al menos un item")
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requestorId: "",
            scheduledReturnDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            reason: "",
            notes: "",
            requestorInfo: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                type: ""
            },
            blockBlackListed: true,
            loanDetails: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "loanDetails",
    });

    useEffect(() => {
        form.setValue("requestorInfo", requestorInfo);
    }, [requestorInfo, form]);

    useEffect(() => {
        // Load all conditions when component mounts
        const loadConditions = async () => {
            try {
                await getConditions(1, 100); // Load first 100 conditions
            } catch (error) {
                console.error("Error loading conditions:", error);
            }
        };
        loadConditions();
    }, [getConditions]);

    // Debug useEffect para monitorear el estado del modal
    useEffect(() => {
    }, [showBlacklistDialog, pendingLoanData]);

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
        if (!item) return;

        // Verificar si el item ya está en la lista
        if (scannedItems.some(i => i.code === item.code)) {
            toast.error("Este item ya ha sido agregado");
            return;
        }

        // Verificar disponibilidad
        if (!item.availableForLoan) {
            toast.error("Este item no está disponible para préstamo");
            return;
        }

        let conditionId = item.conditionId?.toString();
        let conditionName = "No especificada";

        if (item.conditionId) {
            const condition = await getConditionById(item.conditionId.toString());
            if (condition) {
                conditionName = condition.name;
            } else if (conditions.length > 0) {
                conditionId = conditions[0].id.toString();
                conditionName = conditions[0].name;
                toast.warning(`La condición con id ${item.conditionId} no fue encontrada. Se ha establecido la condición "${conditionName}" por defecto.`);
            }
        } else if (conditions.length > 0) {
            conditionId = conditions[0].id.toString();
            conditionName = conditions[0].name;
        }

        const newItem: ScannedItem = {
            code: item.code,
            name: item.name,
            characteristics: item.modelCharacteristics || "",
            image: item.images?.[0]?.filePath || null,
            exitObservations: "",
            conditionId: conditionId,
            exitConditionId: conditionId,
            quantity: 1,
            stock: item.stock
        };

        setScannedItems(prev => [...prev, newItem]);

        // Agregar el detalle al formulario
        const loanDetail = {
            itemId: Number(item.id),
            exitConditionId: Number(conditionId) || 0,
            exitObservations: "",
            quantity: 1
        };

        form.setValue("loanDetails", [...form.getValues("loanDetails"), loanDetail]);
    };

    const handleObservationsChange = (code: string, observations: string) => {
        setScannedItems(prev =>
            prev.map(item =>
                item.code === code ? { ...item, exitObservations: observations } : item
            )
        );

        form.setValue("loanDetails", form.getValues("loanDetails").map(detail =>
            detail.itemId === Number(code) ? { ...detail, exitObservations: observations } : detail
        ));
    };

    const handleExitConditionChange = (itemCode: string, conditionId: string | number) => {
        const conditionIdStr = conditionId.toString();

        setScannedItems(prev =>
            prev.map(item =>
                item.code === itemCode ? { ...item, exitConditionId: conditionIdStr } : item
            )
        );

        // Update form values
        const currentDetails = form.getValues("loanDetails");
        const inventoryItem = scannedItems.find(i => i.code === itemCode);
        const updatedDetails = currentDetails.map(detail => {
            if (inventoryItem && detail.itemId === Number(inventoryItem.code)) {
                return { ...detail, exitConditionId: Number(conditionId) };
            }
            return detail;
        });
        form.setValue("loanDetails", updatedDetails);
    };

    const handleQuantityChange = (itemCode: string, quantity: number) => {

        // Find the item to get its stock limit
        const item = scannedItems.find(i => i.code === itemCode);
        if (item) {
            // Validate stock limit (max 7 digits)
            if (quantity > 9999999) {
                toast.error("La cantidad no puede exceder 9,999,999");
                return;
            }

            // Validate against available stock
            if (quantity > item.stock) {
                toast.error(`La cantidad no puede exceder el stock disponible (${item.stock})`);
                return;
            }

            // Ensure minimum quantity
            if (quantity < 1) {
                quantity = 1;
            }
        }

        setScannedItems(prev =>
            prev.map(item =>
                item.code === itemCode ? { ...item, quantity } : item
            )
        );

        // Update form values
        const currentDetails = form.getValues("loanDetails");
        const updatedDetails = currentDetails.map(detail => {
            if (detail.itemId === Number(itemCode)) {
                return { ...detail, quantity };
            }
            return detail;
        });
        form.setValue("loanDetails", updatedDetails);
    };

    const handleRemoveItem = (code: string) => {
        setScannedItems(prev => prev.filter(item => item.code !== code));
        form.setValue("loanDetails", form.getValues("loanDetails").filter(detail => detail.itemId !== Number(code)));
    };

    const submitLoanWithBlacklistHandling = async (loanData: LoanCreateType) => {
        try {
            // Llamar directamente al servicio para tener control total sobre la respuesta
            const response = await loanService.create(loanData);

            if (response.success) {
                toast.success("Préstamo creado exitosamente");
                router.push("/loans");
            } else {
                // Verificar si es un error de blacklist
                const errorMessage = response.message.content.join(' ');

                if (errorMessage.toLowerCase().includes("lista negra") ||
                    errorMessage.toLowerCase().includes("blacklist") ||
                    errorMessage.toLowerCase().includes("no puede hacer préstamos") ||
                    errorMessage.toLowerCase().includes("morosos")) {

                    setPendingLoanData(loanData);
                    setShowBlacklistDialog(true);
                } else {
                    // Otro tipo de error
                    toast.error(errorMessage);
                }
            }
        } catch (error: any) {
            // Verificar si es un error de blacklist en el catch
            let errorMessage = '';

            // Intentar obtener el mensaje de error del servidor
            if (error?.response?.data?.message?.content) {
                errorMessage = error.response.data.message.content.join(' ');
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else {
                errorMessage = error?.toString() || '';
            }

            if (errorMessage.toLowerCase().includes("lista negra") ||
                errorMessage.toLowerCase().includes("blacklist") ||
                errorMessage.toLowerCase().includes("no puede hacer préstamos") ||
                errorMessage.toLowerCase().includes("morosos")) {

                setPendingLoanData(loanData);
                setShowBlacklistDialog(true);
            } else {
                // Otro tipo de error
                toast.error("Error al crear el préstamo");
            }
        }
    };

    const handleSubmit = async () => {
        let loanCreate: LoanCreateType | undefined;

        try {
            const formData = form.getValues();

            // Refrescar stock de todos los items antes de validar
            const refreshedItems = await Promise.all(
                scannedItems.map(async (item) => {
                    const inventoryItem = await getInventoryItemByCode(item.code);
                    return {
                        ...item,
                        stock: inventoryItem?.stock ?? item.stock,
                    };
                })
            );

            // Validar usando Zod
            const validationResult = formSchema.safeParse(formData);

            if (!validationResult.success) {
                // Mostrar errores de validación en el formulario
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

                    // Focus on specific fields based on the error path
                    if (fieldPath.includes('requestorId')) {
                        const requestorSection = document.querySelector('[data-section="requestor"]');
                        requestorSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else if (fieldPath.includes('scheduledReturnDate')) {
                        const dateInput = document.querySelector('[data-field="scheduledReturnDate"]');
                        dateInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else if (fieldPath.includes('reason')) {
                        const reasonInput = document.querySelector('[data-field="reason"]');
                        reasonInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else if (fieldPath.includes('loanDetails')) {
                        const detailsSection = document.querySelector('[data-section="loan-details"]');
                        detailsSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }

                toast.error("Por favor, complete todos los campos requeridos");
                return;
            }

            // Validar stock actualizado
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

            // Primero actualiza la condición y el stock de cada item
            for (const item of refreshedItems) {
                const inventoryItem = await getInventoryItemByCode(item.code);
                if (!inventoryItem) {
                    toast.error(`No se pudo encontrar el item "${item.name}" para actualizar su condición.`);
                    return;
                }
                const updateRes = await inventoryService.updateCondition(inventoryItem.id, Number(item.exitConditionId), item.stock);
                if (!updateRes.success) {
                    toast.error(`Error al actualizar la condición del item "${item.name}"`);
                    return;
                }
            }

            // Construir loanDetails con la condición seleccionada y stock actualizado
            const loanDetails = await Promise.all(refreshedItems.map(async item => {
                const inventoryItem = await getInventoryItemByCode(item.code);
                return {
                    itemId: Number(inventoryItem?.id) || 0,
                    exitConditionId: Number(item.exitConditionId),
                    exitObservations: item.exitObservations,
                    quantity: item.quantity
                };
            }));

            loanCreate = {
                requestorId: formData.requestorId,
                scheduledReturnDate: format(formData.scheduledReturnDate, "yyyy-MM-dd'T'HH:mm"),
                reason: formData.reason,
                notes: formData.notes || "",
                blockBlackListed: true,
                loanDetails
            };

            // Crear el préstamo SOLO si todas las actualizaciones fueron exitosas
            await submitLoanWithBlacklistHandling(loanCreate);
        } catch (error: any) {
            // Verificar si es un error de blacklist en el catch
            let errorMessage = '';
            if (error?.response?.data?.message?.content) {
                errorMessage = error.response.data.message.content.join(' ');
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else {
                errorMessage = error?.toString() || '';
            }
            toast.error(errorMessage || "Error al crear el préstamo");
        }
    };

    const handleBlacklistContinue = async () => {
        if (!pendingLoanData) return;

        try {
            // Send the request again with blockBlackListed: false
            const loanDataWithoutBlacklist = {
                ...pendingLoanData,
                blockBlackListed: false
            };

            const response = await loanService.create(loanDataWithoutBlacklist);

            if (response.success) {
                // Solo mostrar toast de éxito y redirigir después de confirmación exitosa
                toast.success("Préstamo creado exitosamente");
                setShowBlacklistDialog(false);
                setPendingLoanData(null);
                router.push("/loans");
            } else {
                // Si hay otro error después del retry
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
        // No mostrar toast aquí, solo cerrar el modal
    };

    return (
        <div className="max-w-6xl mx-auto mb-10">
            <div className="flex justify-between items-center mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/operations">Operaciones</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/loans" className="flex items-center gap-1">
                                <Handshake className="h-4 w-4 text-primary" />
                                Préstamos
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Nuevo Préstamo</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

            </div>

            <Form {...form}>
                <form className="space-y-10">
                    {/* Sección del Solicitante */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start" data-section="requestor">
                        <div className="pt-2">
                            <h2 className="text-lg font-bold">Información del Solicitante</h2>
                            <p className="text-muted-foreground text-sm">
                                Valide la información del solicitante del préstamo.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="tracking-tight text-xl font-bold">Datos del Solicitante</h3>
                                    <p className="text-muted-foreground">Complete la información del solicitante.</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex gap-2 items-end">
                                                <FormField
                                                    control={form.control}
                                                    name="requestorId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>DNI del Solicitante *</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Ingrese el DNI del solicitante"
                                                                    {...field}
                                                                    data-field="requestorId"
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleValidate}
                                                >
                                                    Validar
                                                </Button>
                                            </div>
                                            {isValidated && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Nombres</Label>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {requestorInfo.firstName || 'No disponible'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Apellidos</Label>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {requestorInfo.lastName || 'No disponible'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {isValidated && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-sm font-medium">Correo Electrónico</Label>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {requestorInfo.email || 'No disponible'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <Label className="text-sm font-medium">Número de Teléfono</Label>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {requestorInfo.phone || 'No disponible'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {isValidated && (
                                                <div>
                                                    <Label className="text-sm font-medium">Rol</Label>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {requestorInfo.type === 'ESTUDIANTES' ? 'Estudiante' :
                                                            requestorInfo.type === 'DOCENTES' ? 'Docente' :
                                                                requestorInfo.type || 'No disponible'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección del Préstamo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="pt-2">
                            <h2 className="text-lg font-bold">Préstamo</h2>
                            <p className="text-muted-foreground text-sm">
                                Información del préstamo solicitado.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="tracking-tight text-xl font-bold">Información del Préstamo</h3>
                                    <p className="text-muted-foreground">Complete los datos del préstamo.</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="reason"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Motivo del Préstamo *</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                maxLength={250}
                                                                placeholder="Ingrese el motivo del préstamo (máximo 250 caracteres)"
                                                                data-field="reason"
                                                            />
                                                        </FormControl>
                                                        <div className="text-xs text-muted-foreground text-right">
                                                            {field.value?.length || 0}/250
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="scheduledReturnDate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Fecha y Hora de Devolución Programada *</FormLabel>
                                                        <FormControl>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant={"outline"}
                                                                        className={cn(
                                                                            "w-full pl-3 text-left font-normal",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                        data-field="scheduledReturnDate"
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "PPP 'a las' HH:mm", { locale: es })
                                                                        ) : (
                                                                            <span>Seleccionar fecha y hora</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <div className="p-3 border-b">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <label className="text-sm font-medium">Hora:</label>
                                                                            <Input
                                                                                type="time"
                                                                                className="w-32"
                                                                                value={field.value ? format(field.value, "HH:mm") : ""}
                                                                                onChange={(e) => {
                                                                                    if (field.value && e.target.value) {
                                                                                        const [hours, minutes] = e.target.value.split(':').map(Number);
                                                                                        const newDate = new Date(field.value);
                                                                                        newDate.setHours(hours);
                                                                                        newDate.setMinutes(minutes);

                                                                                        // Validate the new datetime
                                                                                        const now = new Date();
                                                                                        const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                                                                                        const fourWeeksFromNow = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000);

                                                                                        if (newDate >= twoHoursFromNow && newDate <= fourWeeksFromNow) {
                                                                                            field.onChange(newDate);
                                                                                        } else {
                                                                                            toast.error("La fecha y hora debe ser mínimo 2 horas y máximo 4 semanas desde ahora");
                                                                                        }
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Selecciona la fecha y luego ajusta la hora
                                                                        </p>
                                                                    </div>
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={(date) => {
                                                                            if (date) {
                                                                                // Preserve the current time when changing date
                                                                                const currentTime = field.value || new Date();
                                                                                const newDate = new Date(date);
                                                                                newDate.setHours(currentTime.getHours());
                                                                                newDate.setMinutes(currentTime.getMinutes());
                                                                                field.onChange(newDate);
                                                                            }
                                                                        }}
                                                                        disabled={(date) => {
                                                                            const now = new Date();
                                                                            const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                                                                            const fourWeeksFromNow = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000);
                                                                            return date < twoHoursFromNow || date > fourWeeksFromNow;
                                                                        }}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Notas Adicionales</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                maxLength={250}
                                                                placeholder="Ingrese notas adicionales (máximo 250 caracteres)"
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección de Detalles del Préstamo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start" data-section="loan-details">
                        <div className="pt-2">
                            <h2 className="text-lg font-bold">Detalles del Préstamo</h2>
                            <p className="text-muted-foreground text-sm">
                                Información de los bienes a prestar y su condición.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="tracking-tight text-xl font-bold">Bienes a Prestar</h3>
                                    <p className="text-muted-foreground">Agregue los bienes que desea prestar.</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold">Items a Prestar</h2>
                                            <Button
                                                type="button"
                                                onClick={() => setIsScanModalOpen(true)}
                                                className="flex items-center gap-2"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Comenzar a agregar Items
                                            </Button>
                                        </div>

                                        {scannedItems.length > 0 ? (
                                            <div className="space-y-4">
                                                {scannedItems.map((item) => (
                                                    <div key={item.code} className="flex items-start gap-4 p-4 border rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex gap-4">
                                                                    {item.image && (
                                                                        <img
                                                                            src={`${process.env.NEXT_PUBLIC_API_URLIMAGE}${item.image}`}
                                                                            alt={item.name}
                                                                            className="w-16 h-16 object-cover rounded"
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <h3 className="font-medium">{item.name}</h3>
                                                                        <p className="text-sm text-muted-foreground">{item.characteristics}</p>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveItem(item.code)}
                                                                >
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                            <div className="mt-4 flex flex-row gap-4 items-end">
                                                                <div className="flex-1">
                                                                    <Label htmlFor={`exit-condition-${item.code}`}>Condición de salida</Label>
                                                                    <p className="text-xs text-muted-foreground mb-2">
                                                                        Condición actual del item: {conditionNames[item.conditionId || ''] || 'No especificada'}
                                                                    </p>
                                                                    <Select
                                                                        value={String(item.exitConditionId || item.conditionId || "")}
                                                                        onValueChange={(value) => {
                                                                            handleExitConditionChange(item.code, value);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="mt-1">
                                                                            <SelectValue placeholder="Seleccionar condición de salida" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {conditions.map(condition => (
                                                                                <SelectItem key={condition.id} value={String(condition.id)}>
                                                                                    {condition.name}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="w-32">
                                                                    <Label htmlFor={`quantity-${item.code}`}>Cantidad</Label>
                                                                    {item.stock === 0 ? (
                                                                        <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-center">
                                                                            <p className="text-xs text-red-600 font-medium">
                                                                                No hay stock de este item
                                                                            </p>
                                                                        </div>
                                                                    ) : (
                                                                        <>
                                                                            <Input
                                                                                id={`quantity-${item.code}`}
                                                                                type="number"
                                                                                min="1"
                                                                                max={item.stock}
                                                                                value={item.quantity}
                                                                                onChange={(e) => handleQuantityChange(item.code, parseInt(e.target.value) || 1)}
                                                                                className="mt-1"
                                                                            />
                                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                                Stock disponible: {item.stock}
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mt-4">
                                                                <Label htmlFor={`observations-${item.code}`}>Observaciones de salida</Label>
                                                                <Textarea
                                                                    id={`observations-${item.code}`}
                                                                    value={item.exitObservations}
                                                                    onChange={(e) => handleObservationsChange(item.code, e.target.value)}
                                                                    placeholder="Ingrese observaciones sobre el estado del item al momento del préstamo (máximo 250 caracteres)"
                                                                    maxLength={250}
                                                                    className="mt-1"
                                                                />
                                                                <div className="text-xs text-muted-foreground text-right mt-1">
                                                                    {item.exitObservations.length}/250
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground">
                                                No hay items agregados. Haga clic en "Comenzar a agregar Items" para comenzar.
                                            </div>
                                        )}

                                        {/* FormMessage for loanDetails validation */}
                                        <FormField
                                            control={form.control}
                                            name="loanDetails"
                                            render={() => (
                                                <FormItem>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Checkbox moved inside the card */}
                                        <div className="pt-4 border-t">
                                            <FormField
                                                control={form.control}
                                                name="blockBlackListed"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>
                                                                Acepto la responsabilidad por cualquier daño o pérdida del bien solicitado
                                                            </FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mt-8 mb-8">
                        <Button variant="outline" onClick={() => router.back()}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={form.formState.isSubmitting || !form.watch("blockBlackListed")}
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

            <AlertDialog open={showBlacklistDialog} onOpenChange={handleBlacklistCancel}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" x2="12" y1="8" y2="12" />
                                <line x1="12" x2="12.01" y1="16" y2="16" />
                            </svg>
                            Usuario en Lista Negra
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                            <div className="space-y-3">
                                <p className="text-base">
                                    El usuario no puede hacer préstamos porque está en la lista negra, ¿desea continuar?
                                </p>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Nota:</strong> Al continuar, se procederá con el préstamo a pesar de que el usuario se encuentra en la lista negra.
                                    </p>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel
                            onClick={handleBlacklistCancel}
                            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-900"
                        >
                            Cancelar Préstamo
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBlacklistContinue}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                        >
                            Continuar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
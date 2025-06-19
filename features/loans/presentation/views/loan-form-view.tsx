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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Handshake, Plus } from "lucide-react";
import { useLoanStore } from "../../context/loan-store";
import { useConditionStore } from "@/features/conditions/context/condition-store";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { LoanCreate as LoanCreateType, LoanDetail as LoanDetailType } from "../../data/interfaces/loan.interface";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { toast } from "sonner";
import { LoanScanModal } from "../components/loan-scan-modal";
import { z } from "zod";
import { Label } from "@/components/ui/label";

interface RequestorInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
}

interface LoanDetail {
    itemId: number;
    exitConditionId: number;
    exitObservations?: string;
}

interface LoanCreate {
    requestorId: string;
    scheduledReturnDate: string;
    reason: string;
    notes: string;
    blockBlackListed: boolean;
    loanDetails: LoanDetail[];
}

interface ScannedItem {
    code: string;
    name: string;
    characteristics: string;
    image: string | null;
    exitObservations: string;
    conditionId?: string;
}

export function LoanFormView() {
    const router = useRouter();
    const { createLoan } = useLoanStore();
    const { getInventoryItemByCode } = useInventoryStore();
    const { getConditionById } = useConditionStore();
    const [isValidated, setIsValidated] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
    const [conditionNames, setConditionNames] = useState<Record<string, string>>({});

    const [requestorInfo, setRequestorInfo] = useState<RequestorInfo>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
    });

    const formSchema = z.object({
        requestorId: z.string().min(1, "La cédula es requerida"),
        scheduledReturnDate: z.string().min(1, "La fecha de devolución es requerida").refine(
            (date) => {
                const selectedDate = new Date(date);
                return selectedDate > new Date();
            },
            {
                message: "La fecha de devolución debe ser posterior a la fecha actual"
            }
        ),
        reason: z.string().min(1, "El motivo es requerido"),
        notes: z.string().optional(),
        requestorInfo: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
            phone: z.string().optional(),
            role: z.string().optional()
        }),
        blockBlackListed: z.boolean(),
        loanDetails: z.array(z.object({
            itemId: z.number(),
            exitConditionId: z.number(),
            exitObservations: z.string().optional()
        }))
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requestorId: "",
            scheduledReturnDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            reason: "",
            notes: "",
            requestorInfo: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: ""
            },
            blockBlackListed: false,
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
            // Aquí deberías llamar a tu servicio para validar la cédula
            // Por ahora solo simulamos una validación exitosa
            setIsValidated(true);
            form.clearErrors("requestorId");
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

        const newItem: ScannedItem = {
            code: item.code,
            name: item.name,
            characteristics: item.modelCharacteristics || "",
            image: item.images?.[0]?.filePath || null,
            exitObservations: "",
            conditionId: item.conditionId?.toString()
        };

        setScannedItems(prev => [...prev, newItem]);

        // Agregar el detalle al formulario
        const loanDetail: LoanDetailType = {
            itemId: Number(item.id),
            exitConditionId: Number(item.conditionId) || 0,
            exitObservations: ""
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

    const handleRemoveItem = (code: string) => {
        setScannedItems(prev => prev.filter(item => item.code !== code));
        form.setValue("loanDetails", form.getValues("loanDetails").filter(detail => detail.itemId !== Number(code)));
    };

    const handleSubmit = async () => {
        try {
            const formData = form.getValues();
            console.log("Form data:", formData);

            // Validar usando Zod
            const validationResult = formSchema.safeParse(formData);

            if (!validationResult.success) {
                // Mostrar errores de validación
                const errors = validationResult.error.errors;
                errors.forEach(error => {
                    toast.error(error.message);
                });
                return;
            }

            if (scannedItems.length === 0) {
                toast.error("Debe agregar al menos un item");
                return;
            }

            console.log("Processing loan details...");
            const loanDetails = await Promise.all(scannedItems.map(async item => {
                console.log("Processing item:", item);
                const inventoryItem = await getInventoryItemByCode(item.code);
                console.log("Inventory item found:", inventoryItem);
                return {
                    itemId: Number(inventoryItem?.id) || 0,
                    exitConditionId: Number(inventoryItem?.conditionId) || 0,
                    exitObservations: item.exitObservations
                };
            }));

            console.log("Loan details processed:", loanDetails);

            const loanCreate: LoanCreateType = {
                requestorId: formData.requestorId,
                scheduledReturnDate: formData.scheduledReturnDate,
                reason: formData.reason,
                notes: formData.notes || "",
                blockBlackListed: false,
                loanDetails
            };

            console.log("Sending loan create request:", loanCreate);
            const response = await createLoan(loanCreate);
            console.log("Loan create response:", response);

            toast.success("Préstamo creado exitosamente");
            router.push("/loans");
        } catch (error) {
            console.error("Error creating loan:", error);
            toast.error("Error al crear el préstamo");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
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
                <Button variant="destructive" className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                    Lista Negra
                </Button>
            </div>

            <Form {...form}>
                <form className="space-y-10">
                    {/* Sección del Solicitante */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        <div className="pt-2">
                            <h2 className="text-lg font-bold">Solicitante</h2>
                            <p className="text-muted-foreground text-sm">
                                Datos personales y de contacto del solicitante del préstamo.
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="flex flex-col space-y-1.5 p-6">
                                    <h3 className="tracking-tight text-xl font-bold">Información del Solicitante</h3>
                                    <p className="text-muted-foreground">Complete los datos del solicitante.</p>
                                </div>
                                <div className="p-6 pt-0">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="requestorId"
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel>Cédula</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleValidate}
                                                    className="mt-8"
                                                >
                                                    Validar
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="requestorInfo.firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nombres</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} disabled={!isValidated} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="requestorInfo.lastName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Apellidos</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} disabled={!isValidated} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="requestorInfo.email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Correo Electrónico</FormLabel>
                                                            <FormControl>
                                                                <Input type="email" {...field} disabled={!isValidated} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="requestorInfo.phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Número de Teléfono</FormLabel>
                                                            <FormControl>
                                                                <Input type="tel" {...field} disabled={!isValidated} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="requestorInfo.role"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Rol</FormLabel>
                                                            <FormControl>
                                                                <select
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                                                                    {...field}
                                                                    disabled={!isValidated}
                                                                >
                                                                    <option value="">Seleccionar rol</option>
                                                                    <option value="estudiante">Estudiante</option>
                                                                    <option value="docente">Docente</option>
                                                                    <option value="administrativo">Administrativo</option>
                                                                </select>
                                                            </FormControl>
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
                                                        <FormLabel>Motivo del Préstamo</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="scheduledReturnDate"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Fecha y Hora de Devolución Programada</FormLabel>
                                                        <div className="flex gap-2">
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                            variant={"outline"}
                                                                            className={cn(
                                                                                "w-full pl-3 text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            {field.value ? (
                                                                                format(new Date(field.value), "PPP HH:mm", { locale: es })
                                                                            ) : (
                                                                                <span>Seleccione una fecha y hora</span>
                                                                            )}
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0" align="start">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value ? new Date(field.value) : undefined}
                                                                        onSelect={(date) => {
                                                                            if (date) {
                                                                                const now = new Date();
                                                                                const selectedDate = new Date(date);
                                                                                selectedDate.setHours(now.getHours());
                                                                                selectedDate.setMinutes(now.getMinutes());
                                                                                field.onChange(format(selectedDate, "yyyy-MM-dd'T'HH:mm"));
                                                                            }
                                                                        }}
                                                                        disabled={(date) =>
                                                                            date < new Date()
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                    <div className="p-3 border-t">
                                                                        <Input
                                                                            type="time"
                                                                            value={field.value ? format(new Date(field.value), "HH:mm") : ""}
                                                                            onChange={(e) => {
                                                                                if (field.value) {
                                                                                    const [hours, minutes] = e.target.value.split(":");
                                                                                    const date = new Date(field.value);
                                                                                    date.setHours(parseInt(hours));
                                                                                    date.setMinutes(parseInt(minutes));
                                                                                    field.onChange(format(date, "yyyy-MM-dd'T'HH:mm"));
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
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
                                                            <Textarea {...field} />
                                                        </FormControl>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
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
                                                                        <p className="text-sm text-muted-foreground mt-1">
                                                                            <span className="font-medium">Condición de salida:</span> {item.conditionId ? conditionNames[item.conditionId] || "No especificada" : "No especificada"}
                                                                        </p>
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
                                                            <div className="mt-4">
                                                                <Label htmlFor={`observations-${item.code}`}>Observaciones de salida</Label>
                                                                <Textarea
                                                                    id={`observations-${item.code}`}
                                                                    value={item.exitObservations}
                                                                    onChange={(e) => handleObservationsChange(item.code, e.target.value)}
                                                                    placeholder="Ingrese observaciones sobre el estado del item al momento del préstamo"
                                                                    className="mt-1"
                                                                />
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                        <div className="flex items-center gap-2">
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
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? "Creando..." : "Solicitar Préstamo"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>

            <LoanScanModal
                isOpen={isScanModalOpen}
                onClose={() => setIsScanModalOpen(false)}
                onScanComplete={handleScanComplete}
            />
        </div>
    );
} 
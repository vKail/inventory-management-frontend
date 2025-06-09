"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InventoryFormData } from "../../data/interfaces/inventory.interface";
import { inventorySchema } from "../../data/schemas/inventory.schema";
import { IdentificationSection } from "./form-sections/identification-section";
import { GeneralInfoSection } from "./form-sections/general-info-section";
import { AdministrativeSection } from "./form-sections/administrative-section";
import { TechnicalSection } from "./form-sections/technical-section";
import { AccountingSection } from "./form-sections/accounting-section";
import { ImageSection } from "./form-sections/image-section";
import { useInventoryStore } from "../../context/inventory-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { inventoryService } from "../../services/inventory.service";

interface InventoryFormProps {
    initialData?: Partial<InventoryFormData>;
    mode?: 'create' | 'edit';
}

export const InventoryForm = ({ initialData, mode = 'create' }: InventoryFormProps) => {
    const router = useRouter();
    const { createInventoryItem, updateInventoryItem } = useInventoryStore();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [descriptions, setDescriptions] = useState<string[]>([]);
    const [photoDates, setPhotoDates] = useState<string[]>([]);

    const defaultValues: Partial<InventoryFormData> = {
        code: "",
        stock: 0,
        name: "",
        description: "",
        itemTypeId: 0,
        categoryId: 0,
        statusId: 0,
        normativeType: "PROPERTY",
        origin: "PURCHASE",
        locationId: 0,
        custodianId: 0,
        availableForLoan: false,
        identifier: "",
        previousCode: "",
        conditionId: 0,
        certificateId: 0,
        entryOrigin: "",
        entryType: "",
        acquisitionDate: "",
        commitmentNumber: "",
        modelCharacteristics: "",
        brandBreedOther: "",
        identificationSeries: "",
        warrantyDate: "",
        dimensions: "",
        critical: false,
        dangerous: false,
        requiresSpecialHandling: false,
        perishable: false,
        expirationDate: "",
        itemLine: 0,
        accountingAccount: "",
        observations: "",
        ...initialData,
    };

    const form = useForm<InventoryFormData>({
        resolver: zodResolver(inventorySchema),
        defaultValues,
    });

    const handleImageChange = (newFiles: File[], newDescriptions: string[], newDates: string[]) => {
        const validFiles: File[] = [];

        for (const file of newFiles) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`El archivo ${file.name} excede el límite de 10MB`);
                continue;
            }
            validFiles.push(file);
        }

        setSelectedFiles(validFiles);
        setDescriptions(newDescriptions);
        setPhotoDates(newDates);
    };

    // Función para convertir valores a string de manera segura
    const safeToString = (value: any): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value.toString();
        if (value instanceof Date) return value.toISOString();
        return String(value);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            const currentValues = form.getValues();

            // En modo edición, comparamos con los valores iniciales
            if (mode === 'edit' && initialData) {
                Object.entries(currentValues).forEach(([key, value]) => {
                    // Solo incluimos campos que han cambiado
                    if (JSON.stringify(value) !== JSON.stringify(initialData[key as keyof InventoryFormData])) {
                        formData.append(key, safeToString(value));
                    }
                });

                // Aseguramos que el ID esté incluido
                if (initialData.id) {
                    formData.append('id', initialData.id.toString());
                }
            } else {
                // En modo creación, enviamos todos los campos
                Object.entries(currentValues).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, safeToString(value));
                    }
                });
            }

            console.log("Datos a enviar:", Object.fromEntries(formData.entries()));

            if (mode === 'create') {
                const response = await createInventoryItem(formData);
                if (response.success) {
                    // Subir las imágenes después de crear el item
                    if (selectedFiles.length > 0) {
                        for (let i = 0; i < selectedFiles.length; i++) {
                            await inventoryService.addImageToId(response.data.id, selectedFiles[i], {
                                type: i === 0 ? 'PRIMARY' : 'SECONDARY',
                                description: descriptions[i] || '',
                                photoDate: photoDates[i] || ''
                            });
                        }
                    }
                    toast.success("Item creado exitosamente");
                    router.push("/inventory");
                } else {
                    toast.error("Error al crear el item");
                }
            } else {
                if (!initialData?.id) {
                    toast.error("No se puede editar el item");
                    return;
                }
                await updateInventoryItem(initialData.id.toString(), Object.fromEntries(formData.entries()));
                toast.success("Item actualizado exitosamente");
                router.push("/inventory");
            }
        } catch (error) {
            console.error("Error en el envío:", error);
            toast.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} el item`);
        }
    };

    return (
        <Form {...form}>
            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                    <IdentificationSection />
                    <GeneralInfoSection />
                    <AdministrativeSection />
                    <TechnicalSection />
                    <AccountingSection />
                    {mode === 'create' && (
                        <ImageSection
                            onImageChange={handleImageChange}
                            selectedFiles={selectedFiles}
                            descriptions={descriptions}
                            setDescriptions={setDescriptions}
                            photoDates={photoDates}
                            setPhotoDates={setPhotoDates}
                        />
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/inventory")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                    >
                        {mode === 'create' ? 'Guardar' : 'Actualizar'}
                    </Button>
                </div>
            </div>
        </Form>
    );
}; 
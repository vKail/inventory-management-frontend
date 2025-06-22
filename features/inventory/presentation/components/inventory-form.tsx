"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InventoryFormData, ItemColor, ItemMaterial } from "../../data/interfaces/inventory.interface";
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
import { ItemMaterialService } from "../../services/item-material.service";
import { ItemColorService } from "../../services/item-color.service";
import { MaterialsSection } from "./form-sections/materials-section";
import { ColorsSection } from "./form-sections/colors-section";

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
    const [selectedMaterials, setSelectedMaterials] = useState<ItemMaterial[]>([]);
    const [selectedColors, setSelectedColors] = useState<ItemColor[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Function to convert string dates to Date objects
    const convertDatesToObjects = (data: any) => {
        if (!data) return data;

        const converted = { ...data };

        // Convert warrantyDate string to Date object
        if (converted.warrantyDate && typeof converted.warrantyDate === 'string') {
            console.log('Converting warrantyDate from string:', converted.warrantyDate);
            converted.warrantyDate = new Date(converted.warrantyDate);
            console.log('Converted warrantyDate to Date object:', converted.warrantyDate);
        }

        // Convert expirationDate string to Date object
        if (converted.expirationDate && typeof converted.expirationDate === 'string') {
            console.log('Converting expirationDate from string:', converted.expirationDate);
            converted.expirationDate = new Date(converted.expirationDate);
            console.log('Converted expirationDate to Date object:', converted.expirationDate);
        }

        return converted;
    };

    const defaultValues: Partial<InventoryFormData> = {
        code: "",
        stock: 1,
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
        warrantyDate: undefined,
        dimensions: "",
        critical: false,
        dangerous: false,
        requiresSpecialHandling: false,
        perishable: false,
        expirationDate: undefined,
        itemLine: 0,
        accountingAccount: "",
        observations: "",
        ...convertDatesToObjects(initialData),
    };

    const form = useForm<InventoryFormData>({
        resolver: zodResolver(inventorySchema),
        defaultValues,
    });

    useEffect(() => {
        if (mode === 'edit' && initialData?.id) {
            // Cargar materiales existentes
            ItemMaterialService.getInstance().getItemMaterials(initialData.id)
                .then((materials: ItemMaterial[]) => setSelectedMaterials(materials))
                .catch((error: Error) => {
                    console.error('Error loading materials:', error);
                });

            // Cargar colores
            ItemColorService.getInstance().getItemColors(initialData.id)
                .then(colors => {
                    setSelectedColors(colors);
                })
                .catch(error => {
                    console.error('Error loading colors:', error);
                });
        }
    }, [mode, initialData]);

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
        if (value instanceof Date) return value.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        return String(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        const isValid = await form.trigger();
        if (!isValid) {
            // Log validation errors to console
            const errors = form.formState.errors;
            console.log('Form validation errors:', errors);
            console.log('Form values:', form.getValues());
            return; // Form validation errors will be shown in FormMessage components
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            const currentValues = form.getValues();

            // Log form values before submission
            console.log('Submitting form with values:', currentValues);

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

            // Log the FormData being sent
            console.log('FormData entries:');
            Array.from(formData.entries()).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });

            if (mode === 'create') {
                const response = await createInventoryItem(formData);
                console.log('Backend response:', response);

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

                    // Agregar los materiales seleccionados
                    for (const material of selectedMaterials) {
                        await ItemMaterialService.getInstance().addMaterialToItem({
                            itemId: response.data.id,
                            materialId: material.materialId,
                            isMainMaterial: material.isMainMaterial
                        });
                    }

                    // Agregar los colores seleccionados
                    for (const color of selectedColors) {
                        await ItemColorService.getInstance().addColorToItem({
                            itemId: response.data.id,
                            colorId: color.colorId,
                            isMainColor: color.isMainColor
                        });
                    }

                    toast.success("Item creado exitosamente");
                    router.push("/inventory");
                } else {
                    // Handle backend validation errors
                    console.error('Backend error:', response);
                    let errorMessage = "Error al crear el item. Por favor, verifique los datos e intente nuevamente.";

                    if (response.message?.content && Array.isArray(response.message.content)) {
                        errorMessage = response.message.content.join(', ');
                    } else if (response.message?.content && typeof response.message.content === 'string') {
                        errorMessage = response.message.content;
                    }

                    form.setError("root", {
                        type: "manual",
                        message: errorMessage
                    });
                }
            } else {
                // Modo edición
                if (!initialData?.id) {
                    form.setError("root", {
                        type: "manual",
                        message: "No se puede editar el item. ID no válido."
                    });
                    return;
                }

                // Actualizar el item
                const updateResponse = await updateInventoryItem(initialData.id.toString(), Object.fromEntries(formData.entries()));
                console.log('Update response:', updateResponse);

                // Actualizar materiales
                const existingMaterials = await ItemMaterialService.getInstance().getItemMaterials(initialData.id);

                // Eliminar materiales que ya no están seleccionados
                for (const existingMaterial of existingMaterials) {
                    if (!selectedMaterials.find((m: ItemMaterial) => m.materialId === existingMaterial.materialId)) {
                        await ItemMaterialService.getInstance().removeMaterialFromItem(existingMaterial.id);
                    }
                }

                // Agregar o actualizar materiales seleccionados
                for (const material of selectedMaterials) {
                    const existingMaterial = existingMaterials.find((m: ItemMaterial) => m.materialId === material.materialId);
                    if (existingMaterial) {
                        // Actualizar si el estado de isMainMaterial cambió
                        if (existingMaterial.isMainMaterial !== material.isMainMaterial) {
                            await ItemMaterialService.getInstance().updateItemMaterial(existingMaterial.id, {
                                isMainMaterial: material.isMainMaterial
                            });
                        }
                    } else {
                        // Agregar nuevo material
                        await ItemMaterialService.getInstance().addMaterialToItem({
                            itemId: initialData.id,
                            materialId: material.materialId,
                            isMainMaterial: material.isMainMaterial
                        });
                    }
                }

                // Actualizar colores
                const existingColors = await ItemColorService.getInstance().getItemColors(initialData.id);

                // Eliminar colores que ya no están seleccionados
                for (const existingColor of existingColors) {
                    if (!selectedColors.find((c: ItemColor) => c.colorId === existingColor.colorId)) {
                        await ItemColorService.getInstance().removeColorFromItem(existingColor.id);
                    }
                }

                // Agregar o actualizar colores seleccionados
                for (const color of selectedColors) {
                    const existingColor = existingColors.find((c: ItemColor) => c.colorId === color.colorId);
                    if (existingColor) {
                        // Actualizar si el estado de isMainColor cambió
                        if (existingColor.isMainColor !== color.isMainColor) {
                            await ItemColorService.getInstance().updateItemColor(existingColor.id, {
                                isMainColor: color.isMainColor
                            });
                        }
                    } else {
                        // Agregar nuevo color
                        await ItemColorService.getInstance().addColorToItem({
                            itemId: initialData.id,
                            colorId: color.colorId,
                            isMainColor: color.isMainColor
                        });
                    }
                }

                toast.success("Item actualizado exitosamente");
                router.push("/inventory");
            }
        } catch (error) {
            console.error("Error en el envío:", error);
            // Set form error instead of toast
            form.setError("root", {
                type: "manual",
                message: `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el item. Por favor, intente nuevamente.`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <div className="space-y-8">
                {/* Display root form error if exists */}
                {form.formState.errors.root && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8">
                    <IdentificationSection />
                    <GeneralInfoSection />
                    <AdministrativeSection />
                    <TechnicalSection />
                    <AccountingSection />
                    <MaterialsSection
                        selectedMaterials={selectedMaterials}
                        onMaterialsChange={setSelectedMaterials}
                        mode={mode}
                    />
                    <ColorsSection
                        selectedColors={selectedColors}
                        onColorsChange={setSelectedColors}
                        mode={mode}
                    />
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : (mode === 'create' ? 'Guardar' : 'Actualizar')}
                    </Button>
                </div>
            </div>
        </Form>
    );
}; 
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

    // Helper function to focus on the first field with an error
    const focusOnFirstError = (errors: any) => {
        const firstErrorField = Object.keys(errors).filter(key => key !== 'root')[0];
        if (!firstErrorField) return;

        console.log('Focusing on first error field:', firstErrorField);

        setTimeout(() => {
            // First, try to find the field by name attribute
            let errorElement: HTMLElement | null = null;

            // Try multiple selectors to find the field
            const selectors = [
                `[name="${firstErrorField}"]`,
                `[data-field="${firstErrorField}"]`,
                `input[name="${firstErrorField}"]`,
                `select[name="${firstErrorField}"]`,
                `textarea[name="${firstErrorField}"]`,
                `[id="${firstErrorField}"]`,
                `[aria-describedby*="${firstErrorField}"]`
            ];

            for (const selector of selectors) {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    errorElement = element;
                    break;
                }
            }

            // If not found by selectors, search through all form elements
            if (!errorElement) {
                const allInputs = document.querySelectorAll('input, select, textarea, [role="combobox"], [data-radix-trigger]');
                Array.from(allInputs).forEach((input) => {
                    if (errorElement) return;
                    const inputElement = input as HTMLElement;
                    if (inputElement.getAttribute('name') === firstErrorField ||
                        inputElement.getAttribute('id') === firstErrorField ||
                        inputElement.getAttribute('data-field') === firstErrorField) {
                        errorElement = inputElement;
                    }
                });
            }

            // Special handling for Combobox components
            if (!errorElement) {
                // Look for Combobox trigger buttons that might contain the field name
                const comboboxTriggers = document.querySelectorAll('[role="combobox"], [data-radix-trigger]');
                Array.from(comboboxTriggers).forEach((trigger) => {
                    if (errorElement) return;
                    const triggerElement = trigger as HTMLElement;
                    const parentFormItem = triggerElement.closest('[data-field]');
                    if (parentFormItem && parentFormItem.getAttribute('data-field') === firstErrorField) {
                        errorElement = triggerElement;
                    }
                });
            }

            if (errorElement) {
                console.log('Found error element:', errorElement);

                // Focus on the element
                errorElement.focus();

                // Scroll to the element with offset for better visibility
                errorElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                // Add a visual highlight to the field with pulsing effect
                const originalBorder = errorElement.style.borderColor;
                const originalBoxShadow = errorElement.style.boxShadow;
                const originalTransition = errorElement.style.transition;

                errorElement.style.borderColor = '#ef4444';
                errorElement.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.3)';
                errorElement.style.transition = 'all 0.3s ease';

                // Also highlight the parent form item if it exists
                const parentFormItem = errorElement.closest('[data-field]');
                if (parentFormItem) {
                    const parentElement = parentFormItem as HTMLElement;
                    parentElement.style.borderColor = '#ef4444';
                    parentElement.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                    parentElement.style.transition = 'all 0.3s ease';
                }

                // Create a pulsing effect
                let pulseCount = 0;
                const pulseInterval = setInterval(() => {
                    if (pulseCount >= 6) {
                        clearInterval(pulseInterval);
                        return;
                    }

                    if (pulseCount % 2 === 0) {
                        errorElement!.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.4)';
                        if (parentFormItem) {
                            const parentElement = parentFormItem as HTMLElement;
                            parentElement.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.3)';
                        }
                    } else {
                        errorElement!.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
                        if (parentFormItem) {
                            const parentElement = parentFormItem as HTMLElement;
                            parentElement.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.1)';
                        }
                    }
                    pulseCount++;
                }, 300);

                // Remove the highlight after 4 seconds
                setTimeout(() => {
                    clearInterval(pulseInterval);
                    errorElement!.style.borderColor = originalBorder;
                    errorElement!.style.boxShadow = originalBoxShadow;
                    errorElement!.style.transition = originalTransition;

                    if (parentFormItem) {
                        const parentElement = parentFormItem as HTMLElement;
                        parentElement.style.borderColor = '';
                        parentElement.style.boxShadow = '';
                        parentElement.style.transition = '';
                    }
                }, 4000);
            } else {
                console.log('Could not find error element for field:', firstErrorField);

                // Fallback: try to find the section containing this field and scroll to it
                const fieldToSectionMap: { [key: string]: string } = {
                    // Identification Section
                    'code': 'identification-section',
                    'name': 'identification-section',
                    'description': 'identification-section',
                    'itemTypeId': 'identification-section',
                    'categoryId': 'identification-section',
                    'statusId': 'identification-section',

                    // General Info Section
                    'normativeType': 'general-info-section',
                    'origin': 'general-info-section',
                    'locationId': 'general-info-section',
                    'custodianId': 'general-info-section',
                    'availableForLoan': 'general-info-section',
                    'identifier': 'general-info-section',
                    'previousCode': 'general-info-section',

                    // Administrative Section
                    'conditionId': 'administrative-section',
                    'certificateId': 'administrative-section',
                    'entryOrigin': 'administrative-section',
                    'entryType': 'administrative-section',
                    'acquisitionDate': 'administrative-section',
                    'commitmentNumber': 'administrative-section',

                    // Technical Section
                    'modelCharacteristics': 'technical-section',
                    'brandBreedOther': 'technical-section',
                    'identificationSeries': 'technical-section',
                    'warrantyDate': 'technical-section',
                    'dimensions': 'technical-section',
                    'critical': 'technical-section',
                    'dangerous': 'technical-section',
                    'requiresSpecialHandling': 'technical-section',
                    'perishable': 'technical-section',
                    'expirationDate': 'technical-section',

                    // Accounting Section
                    'itemLine': 'accounting-section',
                    'accountingAccount': 'accounting-section',
                    'observations': 'accounting-section',
                };

                const sectionId = fieldToSectionMap[firstErrorField];
                if (sectionId) {
                    const sectionElement = document.getElementById(sectionId);
                    if (sectionElement) {
                        sectionElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Add a brief highlight to the section with pulsing effect
                        const originalBorder = sectionElement.style.border;
                        const originalBorderRadius = sectionElement.style.borderRadius;
                        const originalTransition = sectionElement.style.transition;

                        sectionElement.style.border = '2px solid #ef4444';
                        sectionElement.style.borderRadius = '8px';
                        sectionElement.style.transition = 'all 0.3s ease';

                        // Create a pulsing effect for the section
                        let pulseCount = 0;
                        const sectionPulseInterval = setInterval(() => {
                            if (pulseCount >= 4) {
                                clearInterval(sectionPulseInterval);
                                return;
                            }

                            if (pulseCount % 2 === 0) {
                                sectionElement.style.border = '3px solid #ef4444';
                                sectionElement.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
                            } else {
                                sectionElement.style.border = '2px solid #ef4444';
                                sectionElement.style.boxShadow = '0 0 5px rgba(239, 68, 68, 0.2)';
                            }
                            pulseCount++;
                        }, 400);

                        setTimeout(() => {
                            clearInterval(sectionPulseInterval);
                            sectionElement.style.border = originalBorder;
                            sectionElement.style.borderRadius = originalBorderRadius;
                            sectionElement.style.transition = originalTransition;
                            sectionElement.style.boxShadow = '';
                        }, 3000);
                    }
                }
            }
        }, 200); // Increased delay to ensure form is fully rendered
    };

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

            focusOnFirstError(errors);

            // Show a toast notification about validation errors
            const errorCount = Object.keys(errors).filter(key => key !== 'root').length;
            if (errorCount > 0) {
                toast.error(`Por favor, corrija ${errorCount} error${errorCount > 1 ? 'es' : ''} en el formulario`);
            }

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
                console.log('Edit mode - Initial data:', initialData);
                console.log('Edit mode - Current values:', currentValues);

                Object.entries(currentValues).forEach(([key, value]) => {
                    // Solo incluimos campos que han cambiado
                    const initialValue = initialData[key as keyof InventoryFormData];
                    let hasChanged = false;

                    // Manejo especial para campos numéricos
                    if (['custodianId', 'locationId', 'itemTypeId', 'categoryId', 'statusId', 'conditionId', 'certificateId', 'stock', 'itemLine'].includes(key)) {
                        const currentNum = Number(value);
                        const initialNum = Number(initialValue);
                        hasChanged = currentNum !== initialNum;
                        console.log(`Field ${key}: current=${currentNum}, initial=${initialNum}, changed=${hasChanged}`);
                    } else {
                        // Para otros campos, comparación normal
                        hasChanged = JSON.stringify(value) !== JSON.stringify(initialValue);
                    }

                    if (hasChanged) {
                        console.log(`Adding changed field: ${key} = ${value}`);
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
                    handleBackendErrors(response);

                    // Show a general error message
                    toast.error("Por favor, corrija los errores en el formulario");
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
                try {
                    await updateInventoryItem(initialData.id.toString(), Object.fromEntries(formData.entries()));

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
                } catch (error) {
                    console.error('Error updating item:', error);

                    // Handle different types of errors
                    if (error instanceof Error) {
                        // Check if it's a validation error from the backend
                        if (error.message.includes('validation') || error.message.includes('required')) {
                            // Try to parse the error message and map to form fields
                            const errorMessage = error.message;
                            const errorFieldMap: { [key: string]: string } = {
                                'code': 'code',
                                'name': 'name',
                                'description': 'description',
                                'stock': 'stock',
                                'itemTypeId': 'itemTypeId',
                                'categoryId': 'categoryId',
                                'statusId': 'statusId',
                                'normativeType': 'normativeType',
                                'origin': 'origin',
                                'locationId': 'locationId',
                                'custodianId': 'custodianId',
                                'availableForLoan': 'availableForLoan',
                                'identifier': 'identifier',
                                'previousCode': 'previousCode',
                                'conditionId': 'conditionId',
                                'certificateId': 'certificateId',
                                'entryOrigin': 'entryOrigin',
                                'entryType': 'entryType',
                                'acquisitionDate': 'acquisitionDate',
                                'commitmentNumber': 'commitmentNumber',
                                'modelCharacteristics': 'modelCharacteristics',
                                'brandBreedOther': 'brandBreedOther',
                                'identificationSeries': 'identificationSeries',
                                'warrantyDate': 'warrantyDate',
                                'dimensions': 'dimensions',
                                'critical': 'critical',
                                'dangerous': 'dangerous',
                                'requiresSpecialHandling': 'requiresSpecialHandling',
                                'perishable': 'perishable',
                                'expirationDate': 'expirationDate',
                                'itemLine': 'itemLine',
                                'accountingAccount': 'accountingAccount',
                                'observations': 'observations',
                            };

                            // Try to map error to specific field
                            for (const [backendField, formField] of Object.entries(errorFieldMap)) {
                                if (errorMessage.toLowerCase().includes(backendField.toLowerCase())) {
                                    form.setError(formField as any, {
                                        type: "manual",
                                        message: errorMessage
                                    });
                                    break;
                                }
                            }

                            // Focus on the first error field
                            const errors = form.formState.errors;
                            focusOnFirstError(errors);
                            toast.error("Por favor, corrija los errores en el formulario");
                        } else {
                            // General error
                            form.setError("root", {
                                type: "manual",
                                message: error.message
                            });
                            toast.error(error.message);
                        }
                    } else {
                        // Unknown error
                        form.setError("root", {
                            type: "manual",
                            message: "Error al actualizar el item. Por favor, intente nuevamente."
                        });
                        toast.error("Error al actualizar el item. Por favor, intente nuevamente.");
                    }
                }
            }
        } catch (error) {
            console.error("Error en el envío:", error);

            // Handle different types of errors
            let errorMessage = `Error al ${mode === 'create' ? 'crear' : 'actualizar'} el item.`;

            if (error instanceof Error) {
                errorMessage += ` ${error.message}`;
            } else if (typeof error === 'string') {
                errorMessage += ` ${error}`;
            } else {
                errorMessage += " Por favor, intente nuevamente.";
            }

            // Set form error
            form.setError("root", {
                type: "manual",
                message: errorMessage
            });

            // Show toast error
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to handle backend validation errors and map them to form fields
    const handleBackendErrors = (response: any) => {
        if (response.message?.content && Array.isArray(response.message.content)) {
            const errorMessages = response.message.content;

            // Map backend error messages to form field names
            const errorFieldMap: { [key: string]: string } = {
                'code': 'code',
                'name': 'name',
                'description': 'description',
                'stock': 'stock',
                'itemTypeId': 'itemTypeId',
                'categoryId': 'categoryId',
                'statusId': 'statusId',
                'normativeType': 'normativeType',
                'origin': 'origin',
                'locationId': 'locationId',
                'custodianId': 'custodianId',
                'availableForLoan': 'availableForLoan',
                'identifier': 'identifier',
                'previousCode': 'previousCode',
                'conditionId': 'conditionId',
                'certificateId': 'certificateId',
                'entryOrigin': 'entryOrigin',
                'entryType': 'entryType',
                'acquisitionDate': 'acquisitionDate',
                'commitmentNumber': 'commitmentNumber',
                'modelCharacteristics': 'modelCharacteristics',
                'brandBreedOther': 'brandBreedOther',
                'identificationSeries': 'identificationSeries',
                'warrantyDate': 'warrantyDate',
                'dimensions': 'dimensions',
                'critical': 'critical',
                'dangerous': 'dangerous',
                'requiresSpecialHandling': 'requiresSpecialHandling',
                'perishable': 'perishable',
                'expirationDate': 'expirationDate',
                'itemLine': 'itemLine',
                'accountingAccount': 'accountingAccount',
                'observations': 'observations',
            };

            // Set errors for specific fields
            errorMessages.forEach((errorMessage: string) => {
                // Try to extract field name from error message
                for (const [backendField, formField] of Object.entries(errorFieldMap)) {
                    if (errorMessage.toLowerCase().includes(backendField.toLowerCase()) ||
                        errorMessage.toLowerCase().includes(backendField.replace(/([A-Z])/g, ' $1').toLowerCase())) {
                        form.setError(formField as any, {
                            type: "manual",
                            message: errorMessage
                        });
                        break;
                    }
                }
            });

            // Focus on the first error field
            const errors = form.formState.errors;
            focusOnFirstError(errors);
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
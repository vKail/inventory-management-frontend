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
import { useState } from "react";
import { inventoryService } from "../../services/inventory.service";

interface InventoryFormProps {
    initialData?: Partial<InventoryFormData>;
}

export const InventoryForm = ({ initialData }: InventoryFormProps) => {
    const router = useRouter();
    const { createInventoryItem } = useInventoryStore();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imageType, setImageType] = useState<'PRIMARY' | 'SECONDARY' | 'DETAIL'>('PRIMARY');
    const [isPrimary, setIsPrimary] = useState(false);
    const [description, setDescription] = useState('');
    const [photoDate, setPhotoDate] = useState('');

    const form = useForm<InventoryFormData>({
        resolver: zodResolver(inventorySchema),
        defaultValues: {
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
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: File[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file) {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    toast.error(`El archivo ${file.name} excede el límite de 10MB`);
                    continue;
                }
                newFiles.push(file);
            }
        }

        setSelectedFiles(newFiles);
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            const values = form.getValues();

            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            const response = await createInventoryItem(formData);

            if (response.success && response.data?.id) {
                toast.success("Item creado exitosamente");

                // Subir imágenes si hay archivos seleccionados
                if (selectedFiles.length > 0) {
                    try {
                        for (const file of selectedFiles) {
                            await inventoryService.addImageToId(response.data.id, file, {
                                type: imageType,
                                isPrimary,
                                description,
                                photoDate
                            });
                        }
                        toast.success("Imágenes subidas exitosamente");
                    } catch (error) {
                        toast.error("Error al subir las imágenes");
                        console.error(error);
                    }
                }

                router.push("/inventory");
            } else {
                toast.error("Error al crear el item");
            }
        } catch (error) {
            toast.error("Error al crear el item");
            console.error(error);
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
                    <ImageSection
                        onImageChange={handleImageChange}
                        selectedFiles={selectedFiles}
                        imageType={imageType}
                        setImageType={setImageType}
                        isPrimary={isPrimary}
                        setIsPrimary={setIsPrimary}
                        description={description}
                        setDescription={setDescription}
                        photoDate={photoDate}
                        setPhotoDate={setPhotoDate}
                    />
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
                        Guardar
                    </Button>
                </div>
            </div>
        </Form>
    );
}; 
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useInventoryStore } from "../../context/inventory-store";
import { registerSchema, RegisterFormData } from "../../data/schemas/register-schema";
import { ScanModal } from "./scan-modal";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useConditionStore } from "@/features/conditions/context/condition-store";
import { useStateStore } from "@/features/states/context/state-store";
import { useState, useEffect } from "react";
import { IdentificationSection } from "./form-sections/identification-section";
import { GeneralInfoSection } from "./form-sections/general-info-section";
import { ImageSection } from "./form-sections/image-section";
import { AdministrativeSection } from "./form-sections/administrative-section";
import { TechnicalSection } from "./form-sections/technical-section";
import { AccountingSection } from "./form-sections/accounting-section";
import LoaderComponent from "@/shared/components/ui/Loader";
import { Loader2 } from "lucide-react";
import { LocationsSections } from "./form-sections/locations-sections";

interface RegisterFormProps {
  initialData?: InventoryItem | null;
  isEditing?: boolean;
}

export const RegisterForm = ({ initialData, isEditing = false }: RegisterFormProps) => {
  const router = useRouter();
  const { createInventoryItem, updateInventoryItem, uploadItemImage } = useInventoryStore();
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getItemTypes, loading: loadingTypes } = useItemTypeStore();
  const { getConditions, loading: loadingConditions } = useConditionStore();
  const { getStates, loading: loadingStates } = useStateStore();

  useEffect(() => {
    getItemTypes();
    getConditions();
    getStates();
  }, [getItemTypes, getConditions, getStates]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      stock: initialData?.stock || 0,
      itemTypeId: initialData?.itemType?.id || 0,
      categoryId: initialData?.category?.id || 0,
      locationId: initialData?.location?.id || 0,
      conditionId: initialData?.condition?.id || 0,
      statusId: initialData?.status?.id || 0,
      normativeType: initialData?.normativeType || "ADMINISTRATIVE_CONTROL",
      origin: initialData?.origin || "PURCHASE",
      observations: initialData?.observations || "",
      custodianId: initialData?.custodianId || 0,
      identifier: initialData?.identifier || "",
      previousCode: initialData?.previousCode || "",
      certificateId: initialData?.certificate?.id || 0,
      entryOrigin: initialData?.entryOrigin || "",
      entryType: initialData?.entryType || "",
      acquisitionDate: initialData?.acquisitionDate || "",
      commitmentNumber: initialData?.commitmentNumber || "",
      modelCharacteristics: initialData?.modelCharacteristics || "",
      brandBreedOther: initialData?.brandBreedOther || "",
      identificationSeries: initialData?.identificationSeries || "",
      warrantyDate: initialData?.warrantyDate || "",
      dimensions: initialData?.dimensions || "",
      critical: initialData?.critical || false,
      dangerous: initialData?.dangerous || false,
      requiresSpecialHandling: initialData?.requiresSpecialHandling || false,
      perishable: initialData?.perishable || false,
      expirationDate: initialData?.expirationDate || "",
      itemLine: initialData?.itemLine || 0,
      accountingAccount: initialData?.accountingAccount || "",
      availableForLoan: initialData?.availableForLoan || false,
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (initialData && isEditing) {
      form.reset({
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        stock: initialData.stock,
        itemTypeId: initialData.itemType?.id,
        categoryId: initialData.category?.id,
        locationId: initialData.location?.id,
        conditionId: initialData.condition?.id,
        statusId: initialData.status?.id,
        normativeType: initialData.normativeType,
        origin: initialData.origin,
        observations: initialData.observations,
        custodianId: initialData.custodianId,
        identifier: initialData.identifier,
        previousCode: initialData.previousCode,
        certificateId: initialData.certificate?.id,
        entryOrigin: initialData.entryOrigin,
        entryType: initialData.entryType,
        acquisitionDate: initialData.acquisitionDate,
        commitmentNumber: initialData.commitmentNumber,
        modelCharacteristics: initialData.modelCharacteristics,
        brandBreedOther: initialData.brandBreedOther,
        identificationSeries: initialData.identificationSeries,
        warrantyDate: initialData.warrantyDate,
        dimensions: initialData.dimensions,
        critical: initialData.critical,
        dangerous: initialData.dangerous,
        requiresSpecialHandling: initialData.requiresSpecialHandling,
        perishable: initialData.perishable,
        expirationDate: initialData.expirationDate,
        itemLine: initialData.itemLine,
        accountingAccount: initialData.accountingAccount,
        availableForLoan: initialData.availableForLoan,
      });
    }
  }, [initialData, isEditing, form]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      // Separar imageUrl del resto de los datos
      const { imageUrl, ...formData } = data;

      if (isEditing && initialData) {
        const result = await updateInventoryItem(initialData.id, formData);
        if (result.success) {
          // Si hay una nueva imagen, la subimos después de actualizar el producto
          if (imageUrl && imageUrl instanceof File) {
            try {
              await uploadItemImage(initialData.id, imageUrl);
            } catch (error) {
              toast.error("Error al subir la imagen");
            }
          }
          toast.success("Producto actualizado correctamente");
          router.push("/inventory");
        }
      } else {
        const result = await createInventoryItem(formData);
        if (result.success && result.id) {
          // Si hay una imagen, la subimos después de crear el producto
          if (imageUrl && imageUrl instanceof File) {
            try {
              await uploadItemImage(result.id, imageUrl);
            } catch (error) {
              toast.error("Error al subir la imagen");
            }
          }
          toast.success("Producto registrado correctamente");
          router.push("/inventory");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al procesar el formulario";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();
      await onSubmit(formData);
    } else {
      // Mostrar errores específicos
      const errors = form.formState.errors;
      Object.keys(errors).forEach((key) => {
        const error = errors[key as keyof RegisterFormData];
        if (error?.message) {
          toast.error(error.message);
        }
      });
    }
  };

  const handleScanComplete = (code: string) => {
    form.setValue("code", code);
  };

  const isLoading = loadingTypes || loadingConditions || loadingStates;

  if (isLoading) {
    return <LoaderComponent rows={5} columns={2} />;
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <IdentificationSection form={form} onScanClick={() => setScanModalOpen(true)} />
        <GeneralInfoSection form={form} />
        <AdministrativeSection form={form} />
        <LocationsSections form={form} />
        <TechnicalSection form={form} />
        <AccountingSection form={form} />
        <ImageSection form={form} />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inventory")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              <>{isEditing ? "Actualizar" : "Registrar"} Producto</>
            )}
          </Button>
        </div>
      </form>

      <ScanModal
        open={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </Form>
  );
};
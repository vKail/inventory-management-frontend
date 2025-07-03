'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { inventorySchema } from '../../data/schemas/inventory.schema';
import { InventoryFormData } from '../../data/interfaces/inventory.interface';
import { useInventoryStore } from '../../context/inventory-store';
import { useMaterialStore } from '@/features/materials/context/material-store';
import { useColorStore } from '@/features/colors/context/color-store';
import { IdentificationSection } from './form-sections/identification-section';
import { GeneralInfoSection } from './form-sections/general-info-section';
import { AdministrativeSection } from './form-sections/administrative-section';
import { TechnicalSection } from './form-sections/technical-section';
import { AccountingSection } from './form-sections/accounting-section';
import { MaterialsSection } from './form-sections/materials-section';
import { ColorsSection } from './form-sections/colors-section';
import { ImageSection, InventoryImageData } from './form-sections/image-section';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useItemMaterialStore } from '../../context/item-material-store';
import { useItemColorStore } from '../../context/item-color-store';
import { ItemMaterialService } from '../../services/item-material.service';
import { ItemColorService } from '../../services/item-color.service';
import { imageArraySchema } from '../../data/schemas/inventory.schema';

interface InventoryFormProps {
  mode: 'create' | 'edit';
  initialData?: InventoryFormData;
}

export const InventoryForm = ({ mode, initialData }: InventoryFormProps) => {
  const router = useRouter();
  const { createInventoryItem, updateInventoryItem, selectedItem } = useInventoryStore();
  const { materials: allMaterials } = useMaterialStore();
  const { colors: allColors } = useColorStore();

  // Estados para materiales y colores (originales y actuales)
  const [originalMaterials, setOriginalMaterials] = useState<any[]>([]);
  const [currentMaterials, setCurrentMaterials] = useState<any[]>([]);
  const [originalColors, setOriginalColors] = useState<any[]>([]);
  const [currentColors, setCurrentColors] = useState<any[]>([]);
  const [images, setImages] = useState<InventoryImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [materialsError, setMaterialsError] = useState<string>('');
  const [colorsError, setColorsError] = useState<string>('');
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  // Ref para evitar doble submit
  const isSubmitting = useRef(false);

  // Stores para manejar la edición y sincronización de materiales y colores
  const itemMaterialStore = useItemMaterialStore();
  const itemColorStore = useItemColorStore();

  // Instancias de los servicios para fetch explícito
  const itemMaterialService = ItemMaterialService.getInstance();
  const itemColorService = ItemColorService.getInstance();

  // Función refinada para hacer focus y scroll a campos con errores
  const focusOnErrorField = (fieldName: string) => {
    setTimeout(() => {
      let errorElement: HTMLElement | null = null;

      // 1. Buscar el elemento por selectores comunes
      const selectors = [
        `[name="${fieldName}"]`,
        `[data-field="${fieldName}"]`,
        `input[name="${fieldName}"]`,
        `select[name="${fieldName}"]`,
        `textarea[name="${fieldName}"]`,
        `[id="${fieldName}"]`,
        `[aria-describedby*="${fieldName}"]`,
      ];
      for (const selector of selectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          errorElement = element;
          break;
        }
      }

      // 2. Si no se encuentra, buscar triggers de comboBox
      if (!errorElement) {
        // Buscar por [role="combobox"] y [data-radix-trigger]
        const comboTriggers = document.querySelectorAll(`[role="combobox"], [data-radix-trigger]`);
        Array.from(comboTriggers).forEach(trigger => {
          if (errorElement) return;
          const triggerElement = trigger as HTMLElement;
          // Buscar por aria-labelledby, aria-label, data-field, name, id
          if (
            triggerElement.getAttribute('aria-labelledby')?.includes(fieldName) ||
            triggerElement.getAttribute('aria-label') === fieldName ||
            triggerElement.getAttribute('data-field') === fieldName ||
            triggerElement.getAttribute('name') === fieldName ||
            triggerElement.getAttribute('id') === fieldName
          ) {
            errorElement = triggerElement;
          }
        });
      }

      // 3. Manejo especial para secciones de materiales, colores, imágenes, etc.
      const sectionMap: Record<string, string> = {
        materials: 'materials-section',
        colors: 'colors-section',
        images: 'images-section',
        general: 'general-info-section',
        technical: 'technical-section',
        accounting: 'accounting-section',
        administrative: 'administrative-section',
        identification: 'identification-section',
      };
      if (!errorElement && sectionMap[fieldName]) {
        const sectionElement = document.getElementById(sectionMap[fieldName]);
        if (sectionElement) errorElement = sectionElement;
      }

      // 4. Si se encontró el elemento, hacer focus, scroll y highlight
      if (errorElement) {
        // Focus y scroll
        if (typeof errorElement.focus === 'function') errorElement.focus();
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Efecto visual de resaltado
        const originalBorder = errorElement.style.borderColor;
        const originalBoxShadow = errorElement.style.boxShadow;
        const originalTransition = errorElement.style.transition;
        errorElement.style.borderColor = '#ef4444';
        errorElement.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.3)';
        errorElement.style.transition = 'all 0.3s ease';

        // Resaltar el contenedor padre si existe
        const parentFormItem = errorElement.closest('[data-field]');
        if (parentFormItem) {
          const parentElement = parentFormItem as HTMLElement;
          parentElement.style.borderColor = '#ef4444';
          parentElement.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
          parentElement.style.transition = 'all 0.3s ease';
        }

        // Efecto de pulso
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

        // Remover el resaltado después de 4 segundos
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
      }
    }, 200);
  };

  // Function to convert string dates to Date objects
  const convertDatesToObjects = (data: any) => {
    if (!data) return data;

    const converted = { ...data };

    // Convert warrantyDate string to Date object
    if (converted.warrantyDate && typeof converted.warrantyDate === 'string') {
      converted.warrantyDate = new Date(converted.warrantyDate);
    }

    // Convert expirationDate string to Date object
    if (converted.expirationDate && typeof converted.expirationDate === 'string') {
      converted.expirationDate = new Date(converted.expirationDate);
    }

    return converted;
  };

  const defaultValues: InventoryFormData = {
    code: '',
    stock: 1,
    name: '',
    description: '',
    itemTypeId: 0,
    categoryId: 0,
    statusId: 0,
    normativeType: 'PROPERTY' as const,
    origin: 'PURCHASE' as const,
    locationId: 0,
    custodianId: 0,
    availableForLoan: false,
    identifier: '',
    previousCode: '',
    conditionId: 0,
    certificateId: 0,
    entryOrigin: '',
    entryType: '',
    acquisitionDate: new Date(),
    commitmentNumber: '',
    modelCharacteristics: '',
    brandBreedOther: '',
    identificationSeries: '',
    warrantyDate: new Date(),
    dimensions: '',
    critical: false,
    dangerous: false,
    requiresSpecialHandling: false,
    perishable: false,
    expirationDate: new Date(),
    itemLine: 0,
    accountingAccount: '',
    observations: ''
  };

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema) as any,
    defaultValues
  });

  // Load materials and colors from stores
  useEffect(() => {
    const loadStores = async () => {
      try {
        await Promise.all([
          useMaterialStore.getState().getMaterials(),
          useColorStore.getState().getColors()
        ]);
      } catch (error) {
        console.error('Error loading stores:', error);
      }
    };
    loadStores();
  }, []);

  // Al iniciar edición, inicializar los stores de materiales y colores con la data real del backend
  useEffect(() => {
    if (mode === 'edit' && selectedItem) {
      form.reset({
        code: selectedItem.code || '',
        stock: selectedItem.stock || 1,
        name: selectedItem.name || '',
        description: selectedItem.description || '',
        itemTypeId: selectedItem.itemTypeId || 0,
        categoryId: selectedItem.categoryId || 0,
        statusId: selectedItem.statusId || 0,
        normativeType: selectedItem.normativeType || 'PROPERTY',
        origin: selectedItem.origin || 'PURCHASE',
        locationId: selectedItem.locationId || 0,
        custodianId: selectedItem.custodianId || 0,
        availableForLoan: selectedItem.availableForLoan || false,
        identifier: selectedItem.identifier || '',
        previousCode: selectedItem.previousCode || '',
        conditionId: selectedItem.conditionId || 0,
        certificateId: selectedItem.certificateId || 0,
        entryOrigin: selectedItem.entryOrigin || '',
        entryType: selectedItem.entryType || '',
        acquisitionDate: selectedItem.acquisitionDate ? new Date(selectedItem.acquisitionDate) : new Date(),
        commitmentNumber: selectedItem.commitmentNumber || '',
        modelCharacteristics: selectedItem.modelCharacteristics || '',
        brandBreedOther: selectedItem.brandBreedOther || '',
        identificationSeries: selectedItem.identificationSeries || '',
        warrantyDate: selectedItem.warrantyDate ? new Date(selectedItem.warrantyDate) : new Date(),
        dimensions: selectedItem.dimensions || '',
        critical: selectedItem.critical || false,
        dangerous: selectedItem.dangerous || false,
        requiresSpecialHandling: selectedItem.requiresSpecialHandling || false,
        perishable: selectedItem.perishable || false,
        expirationDate: selectedItem.expirationDate ? new Date(selectedItem.expirationDate) : new Date(),
        itemLine: selectedItem.itemLine || 0,
        accountingAccount: selectedItem.accountingAccount || '',
        observations: selectedItem.observations || ''
      });
      // Normalizar y setear materiales y colores
      const normMaterials = (selectedItem.materials || []).map(m => ({
        ...m,
        materialId: m.materialId ?? m.material?.id,
        material: m.material,
      }));
      setOriginalMaterials(normMaterials);
      setCurrentMaterials(normMaterials);
      const normColors = (selectedItem.colors || []).map(c => ({
        ...c,
        colorId: c.colorId ?? c.color?.id,
        color: c.color,
      }));
      setOriginalColors(normColors);
      setCurrentColors(normColors);
    }
    // Limpiar stores al desmontar
    return () => {
      itemMaterialStore.clear();
      itemColorStore.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedItem, form]);

  // Al iniciar edición, inicializar imágenes existentes
  useEffect(() => {
    if (mode === 'edit' && selectedItem && selectedItem.images) {
      setExistingImages(selectedItem.images);
    }
  }, [mode, selectedItem]);

  // Función para obtener solo los campos modificados (stock siempre)
  function getChangedFields(selectedItem: any, formData: any) {
    const changed: Record<string, any> = {};
    Object.keys(formData).forEach((key) => {
      if (key === 'stock') {
        changed[key] = formData[key];
        return;
      }
      const original = selectedItem[key];
      const current = formData[key];
      if (original instanceof Date || current instanceof Date) {
        if (new Date(original).toISOString() !== new Date(current).toISOString()) {
          changed[key] = current;
        }
      } else if (typeof original === 'boolean' || typeof current === 'boolean') {
        if (Boolean(original) !== Boolean(current)) {
          changed[key] = current;
        }
      } else if (original !== current) {
        changed[key] = current;
      }
    });
    return changed;
  }

  // Calcular diferencias para materiales y colores
  function getMaterialDiffs() {
    const toDelete = originalMaterials.filter(
      orig => !currentMaterials.some(cur => cur.materialId === orig.materialId)
    );
    const toAdd = currentMaterials.filter(
      cur => !originalMaterials.some(orig => orig.materialId === cur.materialId)
    );
    const toUpdate = currentMaterials.filter(cur => {
      const orig = originalMaterials.find(o => o.materialId === cur.materialId);
      return orig && orig.isMainMaterial !== cur.isMainMaterial;
    });
    return { toDelete, toAdd, toUpdate };
  }
  function getColorDiffs() {
    const toDelete = originalColors.filter(
      orig => !currentColors.some(cur => cur.colorId === orig.colorId)
    );
    const toAdd = currentColors.filter(
      cur => !originalColors.some(orig => orig.colorId === cur.colorId)
    );
    const toUpdate = currentColors.filter(cur => {
      const orig = originalColors.find(o => o.colorId === cur.colorId);
      return orig && orig.isMainColor !== cur.isMainColor;
    });
    return { toDelete, toAdd, toUpdate };
  }

  // Manejar cambios de flag principal para materiales
  const handleMainMaterialChange = (materials: any[]): void => {
    // Si se está marcando uno como principal, desmarcar cualquier otro
    const hasNewMain = materials.some(m => m.isMainMaterial);
    if (hasNewMain) {
      const updatedMaterials = materials.map(m => ({
        ...m,
        isMainMaterial: m.isMainMaterial // mantener solo el que se marcó como principal
      }));
      setCurrentMaterials(updatedMaterials);
    } else {
      setCurrentMaterials(materials);
    }
  };

  // Manejar cambios de flag principal para colores
  const handleMainColorChange = (colors: any[]): void => {
    // Si se está marcando uno como principal, desmarcar cualquier otro
    const hasNewMain = colors.some(c => c.isMainColor);
    if (hasNewMain) {
      const updatedColors = colors.map(c => ({
        ...c,
        isMainColor: c.isMainColor // mantener solo el que se marcó como principal
      }));
      setCurrentColors(updatedColors);
    } else {
      setCurrentColors(colors);
    }
  };

  // Función para eliminar imagen existente
  const handleDeleteExistingImage = (imageId: number) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Validar materiales y colores
  const validateMaterialsAndColors = (): boolean => {
    let isValid = true;

    // Validar materiales
    if (currentMaterials.length === 0) {
      setMaterialsError('Debe seleccionar al menos un material');
      focusOnErrorField('materials');
      isValid = false;
    } else {
      setMaterialsError('');
    }

    // Validar colores
    if (currentColors.length === 0) {
      setColorsError('Debe seleccionar al menos un color');
      focusOnErrorField('colors');
      isValid = false;
    } else {
      setColorsError('');
    }

    return isValid;
  };

  // Validar imágenes antes de submit
  const validateImages = (): boolean => {
    const result = imageArraySchema.safeParse(images);
    if (!result.success) {
      // Mostrar errores en rojo (toast y/o UI)
      result.error.errors.forEach(err => {
        toast.error(err.message);
      });
      return false;
    }
    return true;
  };

  // Validar campos requeridos del formulario
  const validateRequiredFields = (): boolean => {
    let isValid = true;

    // Validar campos básicos
    if (!form.getValues('name')?.trim()) {
      toast.error('El nombre del item es requerido');
      focusOnErrorField('name');
      isValid = false;
    }

    if (!form.getValues('stock') || form.getValues('stock') < 0) {
      toast.error('El stock debe ser mayor o igual a 0');
      focusOnErrorField('stock');
      isValid = false;
    }

    if (!form.getValues('categoryId')) {
      toast.error('Debe seleccionar una categoría');
      focusOnErrorField('categoryId');
      isValid = false;
    }

    if (!form.getValues('itemTypeId')) {
      toast.error('Debe seleccionar un tipo de item');
      focusOnErrorField('itemTypeId');
      isValid = false;
    }

    if (!form.getValues('locationId')) {
      toast.error('Debe seleccionar una ubicación');
      focusOnErrorField('locationId');
      isValid = false;
    }

    if (!form.getValues('conditionId')) {
      toast.error('Debe seleccionar una condición');
      focusOnErrorField('conditionId');
      isValid = false;
    }

    return isValid;
  };

  // Manejar errores del backend
  const handleBackendErrors = (errors: any) => {
    if (errors && typeof errors === 'object') {
      Object.keys(errors).forEach(fieldName => {
        const errorMessage = Array.isArray(errors[fieldName])
          ? errors[fieldName][0]
          : errors[fieldName];

        toast.error(`${fieldName}: ${errorMessage}`);
        focusOnErrorField(fieldName);
      });
    }
  };

  // Guardar item y relaciones
  const onSubmit = async (data: any) => {
    if (isSubmitting.current) return;

    // Validar campos requeridos
    if (!validateRequiredFields()) {
      return;
    }

    // Validar materiales y colores
    if (!validateMaterialsAndColors()) {
      return;
    }

    // Validar imágenes antes de submit
    if (!validateImages()) {
      setLoading(false);
      isSubmitting.current = false;
      return;
    }

    setLoading(true);
    isSubmitting.current = true;
    try {
      if (mode === 'create') {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
          if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
            formData.append(key, data[key].toString());
          }
        });
        // No enviar imágenes aquí
        const itemResponse = await createInventoryItem(formData);
        if (!itemResponse || !itemResponse.data || !itemResponse.data.id) {
          toast.error('No se pudo crear el item');
          setLoading(false);
          isSubmitting.current = false;
          return;
        }
        const itemId = itemResponse.data.id;
        // Extraer solo los archivos File y subirlos
        if (images && images.length > 0) {
          try {
            // Subir cada imagen con sus metadatos
            await Promise.all(images.map(img =>
              useInventoryStore.getState().addMultipleImagesToId(itemId, [{
                file: img.file,
                description: img.description,
                photoDate: img.photoDate,
                isPrimary: img.isPrimary,
                type: img.isPrimary ? 'PRIMARY' : 'SECONDARY',
              }])
            ));
          } catch (err) {
            toast.error('Error al subir una o más imágenes');
          }
        }
        toast.success('Item creado exitosamente');
        router.push('/inventory');
      } else {
        // --- MODO EDICIÓN ---
        // Eliminar imágenes marcadas antes de actualizar el item
        for (const imageId of imagesToDelete) {
          try {
            await useInventoryStore.getState().deleteImageById(imageId.toString());
          } catch (err) {
            toast.error('Error al eliminar una imagen');
          }
        }
        setImagesToDelete([]);
        const changedFields = getChangedFields(selectedItem, data);
        const updateData = {
          ...changedFields,
          images: images
        };
        console.log('[Actualizar Item] Campos a enviar:', updateData);
        await updateInventoryItem(selectedItem!.id.toString(), updateData);

        // Sincronizar materiales
        const { toDelete: matsToDelete, toAdd: matsToAdd, toUpdate: matsToUpdate } = getMaterialDiffs();
        for (const mat of matsToDelete) {
          console.log('[ItemMaterial] Eliminando relación:', mat);
          await ItemMaterialService.getInstance().removeItemMaterial(mat.id);
        }
        for (const mat of matsToAdd) {
          console.log('[ItemMaterial] Creando relación:', { itemId: selectedItem!.id, materialId: mat.materialId });
          await ItemMaterialService.getInstance().addMaterialToItem({
            itemId: selectedItem!.id,
            materialId: mat.materialId,
            isMainMaterial: mat.isMainMaterial,
          });
        }
        for (const mat of matsToUpdate) {
          console.log('[ItemMaterial] Actualizando relación:', { id: mat.id, isMainMaterial: mat.isMainMaterial });
          await ItemMaterialService.getInstance().updateItemMaterial(mat.id, { isMainMaterial: mat.isMainMaterial });
        }

        // Sincronizar colores
        const { toDelete: colsToDelete, toAdd: colsToAdd, toUpdate: colsToUpdate } = getColorDiffs();
        for (const col of colsToDelete) {
          console.log('[ItemColor] Eliminando relación:', col);
          await ItemColorService.getInstance().removeColorFromItem(col.id);
        }
        for (const col of colsToAdd) {
          console.log('[ItemColor] Creando relación:', { itemId: selectedItem!.id, colorId: col.colorId });
          await ItemColorService.getInstance().addColorToItem({
            itemId: selectedItem!.id,
            colorId: col.colorId,
            isMainColor: col.isMainColor,
          });
        }
        for (const col of colsToUpdate) {
          console.log('[ItemColor] Actualizando relación:', { id: col.id, isMainColor: col.isMainColor });
          await ItemColorService.getInstance().updateItemColor(col.id, { isMainColor: col.isMainColor });
        }

        toast.success('Item actualizado exitosamente');
        router.push('/inventory');
      }
    } catch (error) {
      console.error('Error al actualizar item:', error);
      toast.error('Error al actualizar el item');

      // Manejar errores específicos del backend
      if (error instanceof Error) {
        toast.error(error.message);
      }
      return;
    } finally {
      setLoading(false);
      isSubmitting.current = false;
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

          {/* Materials and Colors sections */}
          <MaterialsSection
            selectedMaterials={currentMaterials}
            onMaterialsChange={handleMainMaterialChange}
            mode={mode}
            error={materialsError}
          />

          <ColorsSection
            selectedColors={currentColors}
            onColorsChange={handleMainColorChange}
            mode={mode}
            error={colorsError}
          />

          {mode === 'edit' && (
            <ImageSection
              images={images}
              setImages={setImages}
              existingImages={existingImages}
              onDeleteExistingImage={handleDeleteExistingImage}
              mode={mode}
              imagesToDelete={imagesToDelete}
              setImagesToDelete={setImagesToDelete}
            />
          )}

          {mode === 'create' && (
            <ImageSection
              images={images}
              setImages={setImages}
              mode={mode}
              imagesToDelete={[]}
              setImagesToDelete={() => { }}
            />
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/inventory')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? (
              <span className="flex items-center"><span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full"></span>Guardando...</span>
            ) : mode === 'create' ? 'Crear Item' : 'Actualizar Item'}
          </Button>
        </div>
      </div>
    </Form>
  );
};

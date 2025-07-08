import { useCallback } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useFormFocus } from './use-form-focus';
import { InventoryFormData } from '../data/interfaces/inventory.interface';
import { toast } from 'sonner';

export const useFormValidation = () => {
    const { focusOnError, focusOnCombobox } = useFormFocus();

    // Mapeo de campos a sus secciones correspondientes
    const fieldSectionMap: Record<string, string> = {
        // Identificación
        code: 'identification-section',
        previousCode: 'identification-section',
        identifier: 'identification-section',
        commitmentNumber: 'identification-section',
        normativeType: 'identification-section',

        // Información General
        name: 'general-info-section',
        description: 'general-info-section',
        stock: 'general-info-section',
        itemTypeId: 'general-info-section',
        categoryId: 'general-info-section',
        statusId: 'general-info-section',

        // Administrativa
        origin: 'administrative-section',
        locationId: 'administrative-section',
        custodianId: 'administrative-section',
        availableForLoan: 'administrative-section',
        entryOrigin: 'administrative-section',
        entryType: 'administrative-section',
        acquisitionDate: 'administrative-section',

        // Técnica
        modelCharacteristics: 'technical-section',
        brandBreedOther: 'technical-section',
        identificationSeries: 'technical-section',
        warrantyDate: 'technical-section',
        dimensions: 'technical-section',
        critical: 'technical-section',
        dangerous: 'technical-section',
        requiresSpecialHandling: 'technical-section',
        perishable: 'technical-section',
        expirationDate: 'technical-section',

        // Contable
        itemLine: 'accounting-section',
        accountingAccount: 'accounting-section',
        observations: 'accounting-section',

        // Condición y Certificado
        conditionId: 'technical-section',
        certificateId: 'technical-section',
    };

    // Campos que usan ComboBox
    const comboboxFields = [
        'itemTypeId',
        'categoryId',
        'statusId',
        'locationId',
        'custodianId',
        'conditionId',
        'certificateId'
    ];

    const handleValidationErrors = useCallback((errors: FieldErrors<InventoryFormData>) => {
        const errorFields = Object.keys(errors);

        if (errorFields.length === 0) return false;

        // Mostrar el primer error encontrado
        const firstErrorField = errorFields[0];
        const error = errors[firstErrorField as keyof InventoryFormData];

        if (error?.message) {
            toast.error(error.message as string);
        }

        // Determinar si es un ComboBox o campo normal
        const isCombobox = comboboxFields.includes(firstErrorField);
        const sectionId = fieldSectionMap[firstErrorField];

        if (isCombobox) {
            focusOnCombobox(firstErrorField, sectionId);
        } else {
            focusOnError(firstErrorField, sectionId);
        }

        return false;
    }, [focusOnError, focusOnCombobox]);

    const validateRequiredFields = useCallback((formData: Partial<InventoryFormData>) => {
        const requiredFields = [
            { field: 'name', message: 'El nombre del item es requerido' },
            { field: 'stock', message: 'El stock debe ser mayor o igual a 0' },
            { field: 'categoryId', message: 'Debe seleccionar una categoría' },
            { field: 'itemTypeId', message: 'Debe seleccionar un tipo de item' },
            { field: 'locationId', message: 'Debe seleccionar una ubicación' },
            { field: 'conditionId', message: 'Debe seleccionar una condición' },
        ];

        for (const { field, message } of requiredFields) {
            const value = formData[field as keyof InventoryFormData];

            if (!value || (typeof value === 'string' && !value.trim()) || (typeof value === 'number' && value <= 0)) {
                toast.error(message);

                const isCombobox = comboboxFields.includes(field);
                const sectionId = fieldSectionMap[field];

                if (isCombobox) {
                    focusOnCombobox(field, sectionId);
                } else {
                    focusOnError(field, sectionId);
                }

                return false;
            }
        }

        return true;
    }, [focusOnError, focusOnCombobox]);

    const validateMaterialsAndColors = useCallback((
        currentMaterials: any[],
        currentColors: any[]
    ) => {
        let isValid = true;

        // Validar materiales
        if (currentMaterials.length === 0) {
            toast.error('Debe seleccionar al menos un material');
            focusOnError('materials', 'materials-section');
            isValid = false;
        }

        // Validar colores
        if (currentColors.length === 0) {
            toast.error('Debe seleccionar al menos un color');
            focusOnError('colors', 'colors-section');
            isValid = false;
        }

        return isValid;
    }, [focusOnError]);

    return {
        handleValidationErrors,
        validateRequiredFields,
        validateMaterialsAndColors,
        fieldSectionMap,
        comboboxFields
    };
}; 
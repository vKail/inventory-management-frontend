import { z } from 'zod';

export const inventorySchema = z.object({
    code: z.string().min(1, 'El código es requerido').max(50, 'El código no puede exceder 50 caracteres'),
    stock: z.number().int().min(1, 'El stock es requerido y debe ser mayor a 0').max(999999, 'El stock no puede exceder 999,999'),
    name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().min(1, 'La descripción es requerida').max(500, 'La descripción no puede exceder 500 caracteres'),
    itemTypeId: z.number().int().min(1, 'El tipo de item es requerido'),
    categoryId: z.number().int().min(1, 'La categoría es requerida'),
    statusId: z.number().int().min(1, 'El estado es requerido'),
    normativeType: z.enum(['PROPERTY', 'CONSUMABLE'], {
        required_error: 'El tipo normativo es requerido'
    }),
    origin: z.enum(['PURCHASE', 'DONATION', 'TRANSFER'], {
        required_error: 'El origen es requerido'
    }),
    locationId: z.number().int().min(1, 'La ubicación es requerida'),
    custodianId: z.number().int().min(1, 'El custodio es requerido'),
    availableForLoan: z.boolean(),
    identifier: z.string().min(1, 'El identificador es requerido').max(100, 'El identificador no puede exceder 100 caracteres'),
    previousCode: z.string().max(50, 'El código anterior no puede exceder 50 caracteres').optional(),
    conditionId: z.number().int().min(1, 'La condición es requerida'),
    certificateId: z.number().int().min(1, 'El certificado es requerido'),
    entryOrigin: z.string().min(1, 'El origen de entrada es requerido').max(20, 'El origen de entrada no puede exceder 20 caracteres'),
    entryType: z.string().min(1, 'El tipo de entrada es requerido').max(20, 'El tipo de entrada no puede exceder 20 caracteres'),
    acquisitionDate: z.string().min(1, 'La fecha de adquisición es requerida'),
    commitmentNumber: z.string().min(1, 'El número de compromiso es requerido').max(20, 'El número de compromiso no puede exceder 20 caracteres'),
    modelCharacteristics: z.string().min(1, 'Las características del modelo son requeridas').max(20, 'Las características del modelo no pueden exceder 20 caracteres'),
    brandBreedOther: z.string().min(1, 'La marca/raza/otro es requerido').max(20, 'La marca/raza/otro no puede exceder 20 caracteres'),
    identificationSeries: z.string().min(1, 'La serie de identificación es requerida').max(20, 'La serie de identificación no puede exceder 20 caracteres'),
    warrantyDate: z.date({
        required_error: 'La fecha de garantía es requerida',
        invalid_type_error: 'La fecha de garantía debe ser una fecha válida'
    }),
    dimensions: z.string().min(1, 'Las dimensiones son requeridas').max(20, 'Las dimensiones no pueden exceder 20 caracteres'),
    critical: z.boolean(),
    dangerous: z.boolean(),
    requiresSpecialHandling: z.boolean(),
    perishable: z.boolean(),
    expirationDate: z.date({
        required_error: 'La fecha de expiración es requerida',
        invalid_type_error: 'La fecha de expiración debe ser una fecha válida'
    }),
    itemLine: z.number().int().min(1, 'La línea de item es requerida').max(999999, 'La línea de item no puede exceder 999,999'),
    accountingAccount: z.string().min(1, 'La cuenta contable es requerida').max(20, 'La cuenta contable no puede exceder 20 caracteres'),
    observations: z.string().max(1000, 'Las observaciones no pueden exceder 1000 caracteres').optional(),
});

export type InventoryFormData = z.infer<typeof inventorySchema>; 
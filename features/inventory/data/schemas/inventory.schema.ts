import { z } from 'zod';

export const inventorySchema = z.object({
    code: z.string().min(1, 'El código es requerido'),
    stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().min(1, 'La descripción es requerida'),
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
    identifier: z.string().min(1, 'El identificador es requerido'),
    previousCode: z.string().optional(),
    conditionId: z.number().int().min(1, 'La condición es requerida'),
    certificateId: z.number().int().min(1, 'El certificado es requerido'),
    entryOrigin: z.string().min(1, 'El origen de entrada es requerido'),
    entryType: z.string().min(1, 'El tipo de entrada es requerido'),
    acquisitionDate: z.string().min(1, 'La fecha de adquisición es requerida'),
    commitmentNumber: z.string().min(1, 'El número de compromiso es requerido'),
    modelCharacteristics: z.string().min(1, 'Las características del modelo son requeridas'),
    brandBreedOther: z.string().min(1, 'La marca/raza/otro es requerido'),
    identificationSeries: z.string().min(1, 'La serie de identificación es requerida'),
    warrantyDate: z.string().min(1, 'La fecha de garantía es requerida'),
    dimensions: z.string().min(1, 'Las dimensiones son requeridas'),
    critical: z.boolean(),
    dangerous: z.boolean(),
    requiresSpecialHandling: z.boolean(),
    perishable: z.boolean(),
    expirationDate: z.string().min(1, 'La fecha de expiración es requerida'),
    itemLine: z.number().int().min(1, 'La línea de item es requerida'),
    accountingAccount: z.string().min(1, 'La cuenta contable es requerida'),
    observations: z.string().optional(),
});

export type InventoryFormData = z.infer<typeof inventorySchema>; 
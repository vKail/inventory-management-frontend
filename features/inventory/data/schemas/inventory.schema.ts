import { z } from 'zod';

export const inventorySchema = z.object({
  code: z
    .string()
    .min(1, 'El código es requerido')
    .max(15, 'El código no puede exceder 15 caracteres'),
  stock: z.coerce
    .number()
    .int()
    .min(1, 'El stock es requerido y debe ser mayor a 0')
    .max(999999, 'El stock no puede exceder 999,999'),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(60, 'El nombre no puede exceder 60 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(250, 'La descripción no puede exceder 250 caracteres'),
  itemTypeId: z.coerce.number().int().min(1, 'El tipo de item es requerido'),
  categoryId: z.coerce.number().int().min(1, 'La categoría es requerida'),
  statusId: z.coerce.number().int().min(1, 'El estado es requerido'),
  normativeType: z.enum(['PROPERTY', 'ADMINISTRATIVE_CONTROL', 'INVENTORY'], {
    required_error: 'El tipo normativo es requerido',
  }),
  origin: z.enum(['PURCHASE', 'DONATION', 'TRANSFER'], {
    required_error: 'El origen es requerido',
  }),
  locationId: z.coerce.number().int().min(1, 'La ubicación es requerida'),
  custodianId: z.coerce.number().int().min(1, 'El custodio es requerido'),
  availableForLoan: z.boolean(),
  identifier: z
    .string()
    .max(100, 'El identificador no puede exceder 100 caracteres')
    .optional(),
  previousCode: z.string().max(50, 'El código anterior no puede exceder 50 caracteres').optional(),
  conditionId: z.coerce.number().int().min(1, 'La condición es requerida'),
  certificateId: z.coerce.number().int().min(1, 'El Acta es requerido'),
  entryOrigin: z
    .string()
    .min(1, 'El origen de entrada es requerido')
    .max(60, 'El origen de entrada no puede exceder 60 caracteres'),
  entryType: z
    .string()
    .min(1, 'El tipo de entrada es requerido')
    .max(60, 'El tipo de entrada no puede exceder 60 caracteres'),
  acquisitionDate: z.date({
    required_error: 'La fecha de adquisición es requerida',
    invalid_type_error: 'La fecha de adquisición debe ser una fecha válida',
  }),
  commitmentNumber: z
    .string()
    .max(60, 'El número de compromiso no puede exceder 60 caracteres')
    .optional(),
  modelCharacteristics: z
    .string()
    .min(1, 'Las características del modelo son requeridas')
    .max(60, 'Las características del modelo no pueden exceder 60 caracteres'),
  brandBreedOther: z
    .string()
    .min(1, 'La marca/raza/otro es requerido')
    .max(60, 'La marca/raza/otro no puede exceder 60 caracteres'),
  identificationSeries: z
    .string()
    .min(1, 'La serie de identificación es requerida')
    .max(60, 'La serie de identificación no puede exceder 60 caracteres'),
  warrantyDate: z.date({
    invalid_type_error: 'La fecha de garantía debe ser una fecha válida',
  }).optional(),
  dimensions: z
    .string()
    .max(60, 'Las dimensiones no pueden exceder 60 caracteres')
    .optional(),
  critical: z.boolean(),
  dangerous: z.boolean(),
  requiresSpecialHandling: z.boolean(),
  perishable: z.boolean(),
  expirationDate: z.date({
    invalid_type_error: 'La fecha de expiración debe ser una fecha válida',
  }).optional(),
  itemLine: z.coerce
    .number({
      required_error: 'La línea de item es requerida',
      invalid_type_error: 'La línea de item debe ser un número',
    })
    .int({ message: 'La línea de item debe ser un número entero' })
    .min(1, 'La línea de item es requerida')
    .max(999999, 'La línea de item no puede exceder 999,999'),
  accountingAccount: z
    .string()
    .min(1, 'La cuenta contable es requerida')
    .max(60, 'La cuenta contable no puede exceder 60 caracteres'),
  observations: z
    .string()
    .max(200, 'Las observaciones no pueden exceder 200 caracteres')
    .optional(),
});

export type InventoryFormData = z.infer<typeof inventorySchema>;

export const imageSchema = z.object({
  id: z.string(),
  file: z.any(), // File no es validable directamente, pero se puede validar que exista
  preview: z.string(),
  description: z.string().min(1, 'La descripción es requerida'),
  photoDate: z.string().min(1, 'La fecha es requerida'),
  isPrimary: z.boolean(),
});

export const imageArraySchema = z.array(imageSchema).refine(
  (images) => images.filter(img => img.isPrimary).length <= 1,
  { message: 'Solo una imagen puede ser principal' }
);

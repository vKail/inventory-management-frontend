import { z } from "zod";

const dateSchema = z.union([
  z.string().refine((val) => val.length > 0, {
    message: "La fecha es requerida"
  }),
  z.date().transform(date => date.toISOString())
]);

export const RegisterSchema = z.object({
  // Campos de identificación
  code: z.string().min(1, "El código del bien es requerido"),
  identificador: z.string().min(1, "El identificador es requerido"),
  nroActaMatriz: z.string().min(1, "El número de acta/matriz es requerido"),
  bldBca: z.enum(["BLD", "BCA"], {
    required_error: "Debe seleccionar un tipo",
  }),

  // Información general
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  itemTypeId: z.number().min(1, "El tipo de item es requerido"),
  categoryId: z.number().min(1, "La categoría es requerida"),
  statusId: z.number().min(1, "El estado es requerido"),
  normativeType: z.enum(["PROPERTY", "ADMINISTRATIVE_CONTROL", "INVENTORY"], {
    required_error: "El tipo normativo es requerido",
  }),
  origin: z.enum(["PURCHASE", "DONATION", "MANUFACTURING", "TRANSFER"], {
    required_error: "El origen es requerido",
  }),
  locationId: z.number().min(1, "La ubicación es requerida"),
  custodianId: z.number().min(1, "El custodio es requerido"),
  availableForLoan: z.boolean().default(false),

  // Información administrativa
  previousCode: z.string().optional(),
  conditionId: z.number().min(1, "La condición es requerida"),
  certificateId: z.number().optional(),
  entryOrigin: z.string().min(1, "El origen de entrada es requerido"),
  entryType: z.string().min(1, "El tipo de entrada es requerido"),
  acquisitionDate: dateSchema,
  commitmentNumber: z.string().optional(),

  // Información técnica
  modelCharacteristics: z.string().min(1, "Las características del modelo son requeridas"),
  brandBreedOther: z.string().min(1, "La marca/raza/otro es requerida"),
  identificationSeries: z.string().min(1, "La serie de identificación es requerida"),
  warrantyDate: dateSchema.optional(),
  dimensions: z.string().optional(),
  critical: z.boolean().default(false),
  dangerous: z.boolean().default(false),
  requiresSpecialHandling: z.boolean().default(false),
  perishable: z.boolean().default(false),
  expirationDate: dateSchema.optional(),
  // Información contable
  itemLine: z.number().min(1, "La línea de item es requerida"),
  accountingAccount: z.string().min(1, "La cuenta contable es requerida"),
  observations: z.string().optional(),

  // Imagen
  imageUrl: z.union([z.string(), z.instanceof(File)]).optional(),
});

export type RegisterFormValues = z.infer<typeof RegisterSchema>;
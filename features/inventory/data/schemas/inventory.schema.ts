import { z } from "zod";

export enum NormativeType {
    PROPERTY = "PROPERTY",
    ADMINISTRATIVE_CONTROL = "ADMINISTRATIVE_CONTROL",
    INVENTORY = "INVENTORY"
}

export enum Origin {
    PURCHASE = "PURCHASE",
    DONATION = "DONATION",
    MANUFACTURING = "MANUFACTURING",
    TRANSFER = "TRANSFER"
}

const certificateSchema = z.object({
    id: z.number(),
    number: z.number(),
    date: z.string(),
    type: z.string(),
    status: z.string(),
    deliveryResponsibleId: z.number(),
    receptionResponsibleId: z.number(),
    observations: z.string(),
    accounted: z.boolean(),
    registrationDate: z.string(),
    updateDate: z.string()
});

const locationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    warehouseId: z.number(),
    parentLocationId: z.number().nullable(),
    type: z.string(),
    building: z.string(),
    floor: z.string(),
    reference: z.string(),
    capacity: z.number(),
    capacityUnit: z.string(),
    occupancy: z.number(),
    qrCode: z.string(),
    coordinates: z.string(),
    notes: z.string()
});

const categorySchema = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    description: z.string(),
    parentCategory: z.any(),
    standardUsefulLife: z.number(),
    depreciationPercentage: z.number()
});

const statusSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string()
});

export const inventoryItemSchema = z.object({
    id: z.number(),
    code: z.string(),
    stock: z.number(),
    name: z.string(),
    description: z.string(),
    categoryId: z.number(),
    normativeType: z.nativeEnum(NormativeType),
    origin: z.nativeEnum(Origin),
    locationId: z.number(),
    custodianId: z.number(),
    availableForLoan: z.boolean(),
    identifier: z.string(),
    previousCode: z.string(),
    certificateId: z.number(),
    entryOrigin: z.string(),
    entryType: z.string(),
    acquisitionDate: z.string(),
    commitmentNumber: z.string(),
    modelCharacteristics: z.string(),
    brandBreedOther: z.string(),
    identificationSeries: z.string(),
    warrantyDate: z.string(),
    dimensions: z.string(),
    critical: z.boolean(),
    dangerous: z.boolean(),
    requiresSpecialHandling: z.boolean(),
    perishable: z.boolean(),
    expirationDate: z.string(),
    itemLine: z.string(),
    accountingAccount: z.string(),
    observations: z.string(),
    activeCustodian: z.boolean(),
    itemType: z.number(),
    registrationUserId: z.number(),
    certificate: certificateSchema,
    colors: z.array(z.string()),
    materials: z.array(z.string()),
    status: statusSchema,
    condition: z.number(),
    location: locationSchema,
    category: categorySchema
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const inventoryListResponseSchema = z.object({
    success: z.boolean(),
    message: z.object({
        content: z.array(z.string()),
        displayable: z.boolean()
    }),
    data: z.object({
        total: z.number(),
        limit: z.number(),
        page: z.number(),
        pages: z.number(),
        records: z.array(inventoryItemSchema)
    })
});

export type InventoryListResponse = z.infer<typeof inventoryListResponseSchema>;

export const inventoryItemResponseSchema = z.object({
    success: z.boolean(),
    message: z.object({
        content: z.array(z.string()),
        displayable: z.boolean()
    }),
    data: inventoryItemSchema
});

export type InventoryItemResponse = z.infer<typeof inventoryItemResponseSchema>;

const dateSchema = z.union([
    z.string().refine((val) => val.length > 0, {
        message: "La fecha es requerida"
    }),
    z.date().transform(date => date.toISOString())
]);

export const InventorySchema = z.object({
    // Información Básica
    code: z.string().min(1, "El código es requerido"),
    name: z.string().min(1, "El nombre es requerido"),
    stock: z.number().min(0, "El stock no puede ser negativo"),
    description: z.string().optional(),

    // Clasificación
    categoryId: z.number().min(1, "La categoría es requerida"),
    statusId: z.number().min(1, "El estado es requerido"),
    locationId: z.number().min(1, "La ubicación es requerida"),
    colorId: z.number().min(1, "El color es requerido"),
    normativeType: z.enum(["PROPERTY", "ADMINISTRATIVE_CONTROL", "INVENTORY"], {
        required_error: "El tipo normativo es requerido",
    }),
    origin: z.enum(["PURCHASE", "DONATION", "MANUFACTURING", "TRANSFER"], {
        required_error: "El origen es requerido",
    }),

    // Información de Adquisición
    acquisitionDate: dateSchema,
    acquisitionValue: z.number().min(0, "El valor de adquisición no puede ser negativo"),
    currentValue: z.number().min(0, "El valor actual no puede ser negativo"),

    // Información de Depreciación
    usefulLife: z.number().min(0, "La vida útil no puede ser negativa"),
    depreciationRate: z.number().min(0, "La tasa de depreciación no puede ser negativa"),
    annualDepreciation: z.number().min(0, "La depreciación anual no puede ser negativa"),
    accumulatedDepreciation: z.number().min(0, "La depreciación acumulada no puede ser negativa"),

    // Información del Producto
    serialNumber: z.string().min(1, "El número de serie es requerido"),
    modelCharacteristics: z.string().min(1, "Las características del modelo son requeridas"),
    brandBreedOther: z.string().min(1, "La marca/raza/otro es requerida"),
    observations: z.string().optional(),
    itemTypeId: z.number()
});

export type InventoryFormValues = z.infer<typeof InventorySchema>; 
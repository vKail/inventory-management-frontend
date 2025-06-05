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
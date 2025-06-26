import { IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { ICondition } from "@/features/conditions/data/interfaces/condition.interface";
import { ItemType } from "@/features/item-types/data/interfaces/item-type.interface";
import { IMaterial } from "@/features/materials/data/interfaces/material.interface";
import { IColor } from "@/features/colors/data/interfaces/color.interface";

// Interfaces base
export interface BaseInventoryItem {
    code: string;
    stock: number;
    name: string;
    description: string;
    itemTypeId: number;
    categoryId: number;
    statusId: number;
    normativeType: 'PROPERTY' | 'ADMINISTRATIVE_CONTROL' | 'INVENTORY';
    origin: 'PURCHASE' | 'DONATION' | 'TRANSFER';
    locationId: number;
    custodianId: number;
    availableForLoan: boolean;
    identifier: string;
    previousCode: string;
    conditionId: number;
    certificateId: number;
    entryOrigin: string;
    entryType: string;
    acquisitionDate: string;
    commitmentNumber: string;
    modelCharacteristics: string;
    brandBreedOther: string;
    identificationSeries: string;
    warrantyDate: string;
    dimensions: string;
    critical: boolean;
    dangerous: boolean;
    requiresSpecialHandling: boolean;
    perishable: boolean;
    expirationDate: string;
    itemLine: number;
    accountingAccount: string;
    observations: string;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryItem extends BaseInventoryItem {
    id: number;
    status?: Status;
    certificate?: Certificate;
    location?: Location;
    category?: Category;
    itemType?: ItemType;
    condition?: ICondition;
    images?: Images[];
    materials?: ItemMaterial[];
    colors?: ItemColor[];
}

export interface Images {
    id: number;
    filePath: string;
    type?: string;
    isPrimary?: boolean;
    description?: string;
    photoDate?: string;
    active?: boolean
}

export interface PaginatedInventoryResponse {
    records: InventoryItem[];
    page: number;
    pages: number;
    total: number;
}

export type InventoryResponse = IHttpResponse<PaginatedInventoryResponse>;

export type InventoryFormData = {
    id?: number;
    code: string;
    stock: number;
    name: string;
    description: string;
    itemTypeId: number;
    categoryId: number;
    statusId: number;
    normativeType: 'PROPERTY' | 'ADMINISTRATIVE_CONTROL' | 'INVENTORY';
    origin: 'PURCHASE' | 'DONATION' | 'TRANSFER';
    locationId: number;
    custodianId: number;
    availableForLoan: boolean;
    identifier: string;
    previousCode?: string;
    conditionId: number;
    certificateId: number;
    entryOrigin: string;
    entryType: string;
    acquisitionDate: string;
    commitmentNumber: string;
    modelCharacteristics: string;
    brandBreedOther: string;
    identificationSeries: string;
    warrantyDate: Date;
    dimensions: string;
    critical: boolean;
    dangerous: boolean;
    requiresSpecialHandling: boolean;
    perishable: boolean;
    expirationDate: Date;
    itemLine: number;
    accountingAccount: string;
    observations?: string;
};

// Interfaces relacionadas
export interface Certificate {
    id: number;
    number: number;
    date: string;
    type: string;
    status: string;
    deliveryResponsibleId: number;
    receptionResponsibleId: number;
    observations: string;
    accounted: boolean;
    registrationDate: string;
    updateDate: string;
}

export interface Status {
    id: number;
    name: string;
    description: string;
}

export interface Location {
    id: number;
    name: string;
    description: string;
    warehouseId: number;
    parentLocationId: number;
    type: string;
    building: string;
    floor: string;
    reference: string;
    capacity: number;
    capacityUnit: string;
    occupancy: number;
    qrCode: string;
    coordinates: string;
    notes: string;
}

export interface Category {
    id: number;
    code: string;
    name: string;
    description: string;
    parentCategory: {
        id: number;
        code: string;
        name: string;
        description: string;
        parentCategory: string;
        standardUsefulLife: number;
        depreciationPercentage: number;
    };
    standardUsefulLife: number;
    depreciationPercentage: number;
}

export interface ItemMaterial {
    id: number;
    itemId: number;
    materialId: number;
    isMainMaterial: boolean;
    material?: IMaterial;
}

export interface ItemColor {
    id: number;
    itemId: number;
    colorId: number;
    isMainColor: boolean;
    color?: IColor;
} 
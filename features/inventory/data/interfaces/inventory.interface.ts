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

export interface Location {
  id: string;
  name: string;
  description: string;
  warehouseId: number;
  parentLocationId: number | null;
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
  id: string;
  code: string;
  name: string;
  description: string;
  standardUsefulLife: number;
  depreciationPercentage: number;
  parentCategory?: any;
}

export interface Status {
  id: string;
  name: string;
  description: string;
}

// Inventory filters interface
export interface InventoryFilters {
  search?: string;
  category?: string;
  department?: string;
  state?: string;
  sortBy?: string;
}

export interface FilterOption {
  id: number | string;
  name: string;
}


// Departamentos
export enum Department {
  COMPUTING = 'computing',
  ELECTRONICS = 'electronics',
  DESIGN = 'design',
  MECHANICS = 'mechanics',
  GENERAL = 'general',
}

// Estado del producto
export enum ProductStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  DAMAGED = 'damaged',
}

export interface LocationOption {
  id: number;
  name: string;
  type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  page: number;
  pages: number;
  records: T[];
}

export interface InventoryItem {
  id: number;
  code: string;
  name: string;
  description: string;
  stock: number;
  itemType: {
    id: number;
    name: string;
    code: string;
    description: string;
  };
  category: {
    id: number;
    name: string;
    code: string;
    description: string;
    standardUsefulLife: number;
    parentCategory?: {
      id: number;
      name: string;
      code: string;
      description: string;
    };
  };
  location: {
    id: number;
    name: string;
    description: string;
    type: string;
    floor: string;
    capacity: number;
    capacityUnit: string;
    occupancy: number;
    coordinates: string;
    reference: string;
    notes: string;
    qrCode: string;
    parentLocationId: number | null;
  };
  condition: {
    id: number;
    name: string;
    description: string;
    requiresMaintenance: boolean;
  };
  status: {
    id: number;
    name: string;
    description: string;
  };
  certificate: {
    id: number;
    number: number;
    date: string;
    type: string;
    status: string;
    deliveryResponsibleId: number;
    receptionResponsibleId: number;
    observations: string;
  };
  normativeType: string;
  origin: "PURCHASE" | "DONATION" | "MANUFACTURING" | "TRANSFER";
  observations: string;
  custodianId: number;
  identifier: string;
  previousCode: string;
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
  availableForLoan: boolean;
  images: string[];
  colors: string[];
  materials: string[];
  barcode?: string;
}

export type InventoryListResponse = ApiResponse<PaginatedResponse<InventoryItem>>;
export type InventoryItemResponse = ApiResponse<InventoryItem>;

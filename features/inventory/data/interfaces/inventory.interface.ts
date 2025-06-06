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

export interface LocationOption extends FilterOption {
  type: string;
}

export interface Category extends FilterOption {
  code: string;
  description: string;
  standardUsefulLife: number;
  parentCategory?: any;
}

export interface Status extends FilterOption {
  code: string;
  description: string;
}

export interface ItemType extends FilterOption {
  code: string;
  description: string;
}

export interface Location extends FilterOption {
  code: string;
  description: string;
  type: string;
}

export interface Color extends FilterOption {
  code: string;
  description: string;
}

export interface Brand extends FilterOption {
  code: string;
  description: string;
}

export interface Model extends FilterOption {
  code: string;
  description: string;
  brand: Brand;
}

export interface Supplier extends FilterOption {
  code: string;
  description: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
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
  stock: number;
  description: string;
  itemTypeId: number;
  itemType: ItemType;
  categoryId: number;
  category: Category;
  statusId: number;
  status: Status;
  normativeType: string;
  origin: string;
  acquisitionDate: string;
  acquisitionValue: number;
  currentValue: number;
  usefulLife: number;
  depreciationRate: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  locationId: number;
  location: Location;
  colorId: number;
  color: Color;
  brandId: number;
  brand: Brand;
  modelId: number;
  model: Model;
  supplierId: number;
  supplier: Supplier;
  serialNumber: string;
  modelCharacteristics: string;
  brandBreedOther: string;
  observations: string;
}

export type InventoryListResponse = ApiResponse<PaginatedResponse<InventoryItem>>;
export type InventoryItemResponse = ApiResponse<InventoryItem>;

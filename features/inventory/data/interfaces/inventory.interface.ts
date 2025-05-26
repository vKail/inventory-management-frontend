// Inventory item interface
export interface InventoryItem {
  id: string;
  barcode: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  description: string;
  imageUrl: string;
  cost: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
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

// Product categories
export enum ProductCategory {
  TECHNOLOGY = 'technology',
  FURNITURE = 'furniture',
  ELECTRONICS = 'electronics',
  TOOLS = 'tools',
  MATERIALS = 'materials',
  OTHER = 'other',
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





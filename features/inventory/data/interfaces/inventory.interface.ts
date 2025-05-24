// Inventory item interface
export interface InventoryItem {
  id: number; // Cambiado de string a number para coincidir con el backend
  barcode: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  description: string;
  imageUrl?: string; // Opcional, ya que no viene en la respuesta del backend
  cost?: number; // Opcional, ya que no viene en la respuesta del backend
  status: ProductStatus;
  createdAt?: Date; // Opcional, ya que no viene en la respuesta del backend
  updatedAt?: Date; // Opcional, ya que no viene en la respuesta del backend
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
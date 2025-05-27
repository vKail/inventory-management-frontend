export interface InventoryItem {
  id: number; // Identificador único del ítem
  barcode: string; // Código del producto
  name: string; // Nombre del producto
  category: string; // Categoría del producto
  department: string; // Departamento asociado
  quantity: number; // Cantidad en inventario
  description: string; // Descripción del producto
  imageUrl?: string; // URL de imagen (opcional)
  cost?: number; // Costo (opcional)
  status: ProductStatus; // Estado del producto
  createdAt?: Date; // Fecha de creación (opcional)
  updatedAt?: Date; // Fecha de actualización (opcional)
  // Campos adicionales del backend que no se editan en el modal
  itemTypeId?: number; // Tipo de ítem (del backend)
  normativeType?: string; // Tipo normativo (del backend)
  origin?: string; // Origen del ítem (del backend)
  locationId?: number; // ID de ubicación (del backend)
  custodianId?: number; // ID del custodio (del backend)
  availableForLoan?: boolean; // Disponible para préstamo (del backend)
  identifier?: string; // Identificador adicional (del backend)
  previousCode?: string; // Código anterior (del backend)
  certificateId?: number; // ID del certificado (del backend)
  conditionId?: number; // ID de condición (del backend)
  entryOrigin?: string; // Origen de entrada (del backend)
  entryType?: string; // Tipo de entrada (del backend)
  acquisitionDate?: string; // Fecha de adquisición (del backend)
  commitmentNumber?: string; // Número de compromiso (del backend)
  modelCharacteristics?: string; // Características del modelo (del backend)
  brandBreedOther?: string; // Marca u otro (del backend)
  identificationSeries?: string; // Serie de identificación (del backend)
  warrantyDate?: string; // Fecha de garantía (del backend)
  dimensions?: string; // Dimensiones (del backend)
  critical?: boolean; // Crítico (del backend)
  dangerous?: boolean; // Peligroso (del backend)
  requiresSpecialHandling?: boolean; // Requiere manejo especial (del backend)
  perishable?: boolean; // Perecedero (del backend)
  expirationDate?: string; // Fecha de expiración (del backend)
  itemLine?: number; // Línea del ítem (del backend)
  accountingAccount?: string; // Cuenta contable (del backend)
  observations?: string; // Observaciones (del backend)
  activeCustodian?: boolean; // Custodio activo (del backend)
  registrationUserId?: number; // ID del usuario de registro (del backend)
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
export interface LocationOption {
  id: number;
  name: string;
  type: string;
}

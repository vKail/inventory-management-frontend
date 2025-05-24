import { create } from 'zustand';
import { InventoryItem, ProductStatus, InventoryFilters, ProductCategory, Department } from '../data/interfaces/inventory.interface';
import { getInventoryItems, updateInventoryItem } from '../services/inventory.service';

// Mapeo de statusId a ProductStatus
const mapStatusIdToProductStatus = (statusId: number): ProductStatus => {
  const statusMap: { [key: number]: ProductStatus } = {
    1: ProductStatus.AVAILABLE,
    2: ProductStatus.IN_USE,
    3: ProductStatus.MAINTENANCE,
    4: ProductStatus.DAMAGED,
  };
  return statusMap[statusId] || ProductStatus.DAMAGED;
};

// Mapeo de ProductStatus a statusId
const mapProductStatusToStatusId = (status: ProductStatus): number => {
  const statusMap: { [key in ProductStatus]: number } = {
    [ProductStatus.AVAILABLE]: 1,
    [ProductStatus.IN_USE]: 2,
    [ProductStatus.MAINTENANCE]: 3,
    [ProductStatus.DAMAGED]: 4,
  };
  return statusMap[status];
};

// Mapeo de categoryId a nombres de categorías
const mapCategoryIdToName = (categoryId: number): string => {
  const categoryMap: { [key: number]: ProductCategory } = {
    1: ProductCategory.TECHNOLOGY,
    2: ProductCategory.ELECTRONICS,
    3: ProductCategory.FURNITURE,
    4: ProductCategory.TOOLS,
  };
  return categoryMap[categoryId] || ProductCategory.OTHER;
};

// Mapeo de categoría a categoryId
const mapCategoryToCategoryId = (category: string): number => {
  const categoryMap: { [key in ProductCategory]: number } = {
    [ProductCategory.TECHNOLOGY]: 1,
    [ProductCategory.ELECTRONICS]: 2,
    [ProductCategory.FURNITURE]: 3,
    [ProductCategory.TOOLS]: 4,
    [ProductCategory.MATERIALS]: 0,
    [ProductCategory.OTHER]: 0,
  };
  return categoryMap[category as ProductCategory] || 0;
};

// Mapeo de locationId a nombres de departamentos
const mapLocationIdToDepartment = (locationId: number): string => {
  const locationMap: { [key: number]: Department } = {
    1: Department.COMPUTING,
    2: Department.ELECTRONICS,
    3: Department.DESIGN,
    4: Department.MECHANICS,
  };
  return locationMap[locationId] || Department.GENERAL;
};

// Mapeo de departamento a locationId
const mapDepartmentToLocationId = (department: string): number => {
  const departmentMap: { [key in Department]: number } = {
    [Department.COMPUTING]: 1,
    [Department.ELECTRONICS]: 2,
    [Department.DESIGN]: 3,
    [Department.MECHANICS]: 4,
    [Department.GENERAL]: 0,
  };
  return departmentMap[department as Department] || 0;
};

// Mapea un ítem del backend a InventoryItem
const mapBackendItemToInventoryItem = (record: any): InventoryItem => ({
  id: record.id,
  name: record.name,
  description: record.description || 'Sin descripción',
  barcode: record.code,
  category: mapCategoryIdToName(record.categoryId),
  department: mapLocationIdToDepartment(record.locationId),
  quantity: record.stock,
  status: mapStatusIdToProductStatus(record.statusId),
  imageUrl: undefined,
  cost: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  itemTypeId: record.itemTypeId,
  normativeType: record.normativeType,
  origin: record.origin,
  locationId: record.locationId,
  custodianId: record.custodianId,
  availableForLoan: record.availableForLoan,
  identifier: record.identifier,
  previousCode: record.previousCode,
  certificateId: record.certificateId,
  conditionId: record.conditionId,
  entryOrigin: record.entryOrigin,
  entryType: record.entryType,
  acquisitionDate: record.acquisitionDate,
  commitmentNumber: record.commitmentNumber,
  modelCharacteristics: record.modelCharacteristics,
  brandBreedOther: record.brandBreedOther,
  identificationSeries: record.identificationSeries,
  warrantyDate: record.warrantyDate,
  dimensions: record.dimensions,
  critical: record.critical,
  dangerous: record.dangerous,
  requiresSpecialHandling: record.requiresSpecialHandling,
  perishable: record.perishable,
  expirationDate: record.expirationDate,
  itemLine: record.itemLine,
  accountingAccount: record.accountingAccount,
  observations: record.observations,
  activeCustodian: record.activeCustodian,
  registrationUserId: record.registrationUserId,
});

// Mapea un InventoryItem al formato del backend, asegurando que solo se envíen los campos esperados
const mapInventoryItemToBackend = (item: InventoryItem, originalItem: any): any => {
  // Campos que el backend espera
  const updatedFields = {
    code: item.barcode,
    stock: item.quantity,
    name: item.name,
    description: item.description,
    itemTypeId: originalItem.itemTypeId,
    categoryId: mapCategoryToCategoryId(item.category),
    statusId: mapProductStatusToStatusId(item.status),
    normativeType: originalItem.normativeType,
    origin: originalItem.origin,
    locationId: mapDepartmentToLocationId(item.department),
    custodianId: originalItem.custodianId,
    availableForLoan: originalItem.availableForLoan,
    identifier: originalItem.identifier,
    previousCode: originalItem.previousCode,
    certificateId: originalItem.certificateId,
    conditionId: originalItem.conditionId,
    entryOrigin: originalItem.entryOrigin,
    entryType: originalItem.entryType,
    acquisitionDate: originalItem.acquisitionDate,
    commitmentNumber: originalItem.commitmentNumber,
    modelCharacteristics: originalItem.modelCharacteristics,
    brandBreedOther: originalItem.brandBreedOther,
    identificationSeries: originalItem.identificationSeries,
    warrantyDate: originalItem.warrantyDate,
    dimensions: originalItem.dimensions,
    critical: originalItem.critical,
    dangerous: originalItem.dangerous,
    requiresSpecialHandling: originalItem.requiresSpecialHandling,
    perishable: originalItem.perishable,
    expirationDate: originalItem.expirationDate,
    itemLine: originalItem.itemLine,
    accountingAccount: originalItem.accountingAccount,
    observations: originalItem.observations,
  };

  // Filtra los campos undefined para evitar enviar valores no deseados
  return Object.fromEntries(
    Object.entries(updatedFields).filter(([_, value]) => value !== undefined)
  );
};

interface InventoryState {
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  viewMode: 'grid' | 'list' | 'table';
  filters: InventoryFilters;
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  updateItem: (updatedItem: InventoryItem, originalItem: InventoryItem) => Promise<void>;
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  setFilters: (filters: InventoryFilters) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  filteredItems: [],
  viewMode: 'table',
  filters: {
    search: '',
    category: '',
    department: '',
    state: '',
    sortBy: 'nameAsc',
  },
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getInventoryItems();
      const mappedItems: InventoryItem[] = response.data.records.map(mapBackendItemToInventoryItem);
      set({ items: mappedItems, filteredItems: mappedItems, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los ítems';
      set({ error: errorMessage, isLoading: false, items: [], filteredItems: [] });
    }
  },

  updateItem: async (updatedItem: InventoryItem, originalItem: InventoryItem) => {
    set({ isLoading: true, error: null });
    try {
      const backendItem = mapInventoryItemToBackend(updatedItem, originalItem);
      const response = await updateInventoryItem(updatedItem.id, backendItem);
      const mappedItem = mapBackendItemToInventoryItem(response.data);
      set((state) => ({
        items: state.items.map((item) => (item.id === mappedItem.id ? mappedItem : item)),
        filteredItems: state.filteredItems.map((item) =>
          item.id === mappedItem.id ? mappedItem : item
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el ítem';
      set({ error: errorMessage, isLoading: false });
      throw error; // Propagar el error para que el componente lo maneje
    }
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set((state) => ({
    filters: { search: '', category: '', department: '', state: '', sortBy: 'nameAsc' },
    filteredItems: state.items,
  })),

  applyFilters: () => {
    const { items, filters } = get();
    if (!Array.isArray(items)) {
      set({ filteredItems: [] });
      return;
    }
    let filtered = [...items];

    if (filters.search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }

    if (filters.department) {
      filtered = filtered.filter((item) => item.department === filters.department);
    }

    if (filters.state) {
      filtered = filtered.filter((item) => item.status === filters.state);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        if (filters.sortBy === 'nameAsc') return a.name.localeCompare(b.name);
        if (filters.sortBy === 'nameDesc') return b.name.localeCompare(a.name);
        return 0;
      });
    }

    set({ filteredItems: filtered });
  },
}));
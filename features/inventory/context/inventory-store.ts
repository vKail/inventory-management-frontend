import { create } from 'zustand';
import { InventoryItem, ProductStatus, InventoryFilters, ProductCategory, Department } from '../data/interfaces/inventory.interface';
import { getInventoryItems } from '../services/inventory.service';

// Mapeo de statusId a ProductStatus
const mapStatusIdToProductStatus = (statusId: number): ProductStatus => {
  const statusMap: { [key: number]: ProductStatus } = {
    1: ProductStatus.AVAILABLE,
    2: ProductStatus.IN_USE,
    3: ProductStatus.MAINTENANCE,
    4: ProductStatus.DAMAGED,
  };
  return statusMap[statusId] || ProductStatus.DAMAGED; // Fallback a "DAMAGED" si no coincide
};

// Mapeo de categoryId a nombres de categorías
const mapCategoryIdToName = (categoryId: number): string => {
  const categoryMap: { [key: number]: string } = {
    1: ProductCategory.TECHNOLOGY,
    2: ProductCategory.ELECTRONICS,
    3: ProductCategory.FURNITURE,
    4: ProductCategory.TOOLS,
  };
  return categoryMap[categoryId] || ProductCategory.OTHER;
};

// Mapeo de locationId a nombres de departamentos
const mapLocationIdToDepartment = (locationId: number): string => {
  const locationMap: { [key: number]: string } = {
    1: Department.COMPUTING,
    2: Department.ELECTRONICS,
    3: Department.DESIGN,
    4: Department.MECHANICS,
  };
  return locationMap[locationId] || Department.GENERAL;
};

interface InventoryState {
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  viewMode: 'grid' | 'list' | 'table'; // Añadido 'table' para coincidir con InventoryView
  filters: InventoryFilters;
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  setFilters: (filters: InventoryFilters) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  filteredItems: [],
  viewMode: 'table', // Valor por defecto cambiado a 'table' para coincidir con InventoryView
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
      const response = await getInventoryItems(); // Llamada al servicio
      const mappedItems: InventoryItem[] = response.data.records.map((record: any) => ({
        id: record.id,
        name: record.name,
        description: record.description || 'Sin descripción',
        barcode: record.code,
        category: mapCategoryIdToName(record.categoryId),
        department: mapLocationIdToDepartment(record.locationId),
        quantity: record.stock,
        status: mapStatusIdToProductStatus(record.statusId),
        imageUrl: undefined, // No proporcionado por el backend
        cost: undefined, // No proporcionado por el backend
        createdAt: undefined, // No proporcionado por el backend
        updatedAt: undefined, // No proporcionado por el backend
      }));
      set({ items: mappedItems, filteredItems: mappedItems, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los ítems';
      set({ error: errorMessage, isLoading: false, items: [], filteredItems: [] });
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
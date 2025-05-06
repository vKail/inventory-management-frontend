// inventory/context/inventory-store.ts
import { create } from 'zustand';
import { InventoryItem, InventoryFilters } from '../data/interfaces/inventory.interface';
import { getInventoryItems } from '../services/inventory.service';

interface InventoryState {
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  viewMode: 'grid' | 'list';
  filters: InventoryFilters;
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  setViewMode: (mode: 'grid' | 'list') => void;
  setFilters: (filters: InventoryFilters) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  filteredItems: [],
  viewMode: 'grid',
  filters: {
    search: '',
    category: '',
    department: '',
    state: '',
  },
  isLoading: false,
  error: null,

  // Acción para cargar los items
  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await getInventoryItems();
      set({ items, filteredItems: items, isLoading: false });
    } catch (error) {
      set({ error: 'Error al cargar los items', isLoading: false });
    }
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set((state) => ({
    filters: { search: '', category: '', department: '', state: '' },
    filteredItems: state.items,
  })),

  applyFilters: () => {
    const { items, filters } = get();
    const filtered = items.filter((item) => {
      return (
        (!filters.search || item.name.toLowerCase().includes(filters.search.toLowerCase())) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.department || item.department === filters.department) &&
        (!filters.state || item.status === filters.state)
      );
    });
    set({ filteredItems: filtered });
  },
}));
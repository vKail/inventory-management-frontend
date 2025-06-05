import { create } from "zustand";
import { toast } from "sonner";
import { inventoryService } from "../services/inventory.service";
import { InventoryItem } from "../data/interfaces/inventory.interface";

type ViewMode = "table" | "list" | "grid";

interface Filters {
  search?: string;
  category?: string;
  location?: string;
  status?: string;
}

interface InventoryState {
  items: InventoryItem[];
  filteredItems: InventoryItem[];
  selectedItem: InventoryItem | null;
  loading: boolean;
  error: string | null;
  viewMode: ViewMode;
  filters: Filters;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;

  // Methods
  getInventoryItems: (page?: number) => Promise<void>;
  getInventoryItemById: (id: number) => Promise<void>;
  getInventoryItemByCode: (code: string) => Promise<InventoryItem | null>;
  setSelectedItem: (item: InventoryItem | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilters: (filters: Filters) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  filteredItems: [],
  selectedItem: null,
  loading: false,
  error: null,
  viewMode: "table",
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,

  getInventoryItems: async (page = 1) => {
    try {
      set({ loading: true, error: null });
      const response = await inventoryService.getInventoryItems(page);
      set({
        items: response.records,
        filteredItems: response.records,
        currentPage: response.page,
        totalPages: response.pages,
        totalItems: response.total,
        itemsPerPage: response.limit,
        loading: false
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener los items";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  getInventoryItemById: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const item = await inventoryService.getInventoryItemById(id);
      set({ selectedItem: item, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener el item";
      set({ error: message, loading: false, selectedItem: null });
      toast.error(message);
      throw error;
    }
  },

  getInventoryItemByCode: async (code: string) => {
    try {
      set({ loading: true, error: null });
      const item = await inventoryService.getInventoryItemByCode(code);
      set({ loading: false });
      return item || null;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al obtener el item";
      set({ error: message, loading: false });
      toast.error(message);
      return null;
    }
  },

  setSelectedItem: (item) => set({ selectedItem: item }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setFilters: (filters) => set({ filters }),

  applyFilters: () => {
    const { items, filters } = get();
    let filtered = [...items];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm) ||
        item.code?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(item =>
        item.category?.name.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.location) {
      filtered = filtered.filter(item =>
        item.location?.name.toLowerCase() === filters.location?.toLowerCase()
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item =>
        item.status?.name.toLowerCase() === filters.status?.toLowerCase()
      );
    }

    set({ filteredItems: filtered });
  },

  clearFilters: () => {
    set((state) => ({
      filters: {},
      filteredItems: state.items
    }));
  },

  setPage: (page) => {
    const store = get();
    if (page !== store.currentPage) {
      store.getInventoryItems(page);
    }
  }
}));
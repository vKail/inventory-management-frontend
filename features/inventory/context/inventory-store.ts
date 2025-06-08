import { create } from 'zustand';
import { InventoryItem, PaginatedInventoryResponse } from '../data/interfaces/inventory.interface';
import { InventoryService } from '../services/inventory.service';

interface CreateInventoryResponse {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: InventoryItem;
}

interface InventoryState {
    items: InventoryItem[];
    selectedItem: InventoryItem | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    isEmpty: boolean;
    getInventoryItems: (page: number) => Promise<void>;
    getInventoryItem: (id: string) => Promise<void>;
    createInventoryItem: (data: FormData) => Promise<CreateInventoryResponse>;
    updateInventoryItem: (id: string, data: FormData) => Promise<void>;
    deleteInventoryItem: (id: string) => Promise<void>;
    setSelectedItem: (item: InventoryItem | null) => void;
}

const inventoryService = InventoryService.getInstance();

export const useInventoryStore = create<InventoryState>((set) => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    isEmpty: true,

    getInventoryItems: async (page: number) => {
        try {
            set({ loading: true, error: null });
            const response = await inventoryService.getInventoryItems(page);

            if (!response.data || !response.data.records) {
                set({
                    items: [],
                    totalPages: 1,
                    currentPage: 1,
                    isEmpty: true,
                    loading: false,
                    error: 'No hay items en el inventario. ¿Deseas crear el primer item?'
                });
                return;
            }

            set({
                items: response.data.records,
                totalPages: response.data.pages,
                currentPage: response.data.page,
                isEmpty: response.data.records.length === 0,
                loading: false,
                error: response.data.records.length === 0 ? 'No hay items en el inventario. ¿Deseas crear el primer item?' : null
            });
        } catch (error) {
            set({
                error: 'Error al cargar los items',
                loading: false,
                isEmpty: true,
                items: []
            });
            console.error('Error fetching items:', error);
        }
    },

    getInventoryItem: async (id: string) => {
        try {
            set({ loading: true, error: null });
            const item = await inventoryService.getInventoryItemById(id);
            if (item) {
                set({ selectedItem: item, loading: false });
            } else {
                set({ error: 'Item no encontrado', loading: false });
            }
        } catch (error) {
            set({ error: 'Error al cargar el item', loading: false });
            console.error('Error fetching item:', error);
        }
    },

    createInventoryItem: async (data: FormData) => {
        try {
            set({ loading: true, error: null });
            const response = await inventoryService.createInventoryItem(data);
            set({ loading: false, isEmpty: false });
            return response;
        } catch (error) {
            set({ error: 'Error al crear el item', loading: false });
            console.error('Error creating item:', error);
            throw error;
        }
    },

    updateInventoryItem: async (id: string, data: FormData) => {
        try {
            set({ loading: true, error: null });
            await inventoryService.updateInventoryItem(id, data);
            set({ loading: false });
        } catch (error) {
            set({ error: 'Error al actualizar el item', loading: false });
            console.error('Error updating item:', error);
            throw error;
        }
    },

    deleteInventoryItem: async (id: string) => {
        try {
            set({ loading: true, error: null });
            await inventoryService.deleteInventoryItem(id);
            set((state) => {
                const newItems = state.items.filter(item => item.id.toString() !== id);
                return {
                    items: newItems,
                    loading: false,
                    isEmpty: newItems.length === 0,
                    error: newItems.length === 0 ? 'No hay items en el inventario. ¿Deseas crear el primer item?' : null
                };
            });
        } catch (error) {
            set({ error: 'Error al eliminar el item', loading: false });
            console.error('Error deleting item:', error);
            throw error;
        }
    },

    addImageToId: async (id: string) => {
        try {

        } catch (error) {

        }
    },

    setSelectedItem: (item: InventoryItem | null) => {
        set({ selectedItem: item });
    }
})); 
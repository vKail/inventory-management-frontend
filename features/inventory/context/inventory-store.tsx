import { create } from "zustand";
import { InventoryItem } from "../data/interfaces/inventory.interface";
import { inventoryService } from "../services/inventory.service";
import { RegisterFormValues } from "../data/schemas/register-schema";

interface InventoryState {
    items: InventoryItem[];
    loading: boolean;
    error: string | null;
    getInventoryItems: () => Promise<void>;
    getInventoryItem: (id: number) => Promise<InventoryItem | null>;
    createInventoryItem: (data: RegisterFormValues) => Promise<{ success: boolean; id?: number }>;
    updateInventoryItem: (id: number, data: RegisterFormValues) => Promise<{ success: boolean }>;
    deleteInventoryItem: (id: number) => Promise<boolean>;
    uploadItemImage: (id: number, file: File) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
    items: [],
    loading: false,
    error: null,

    getInventoryItems: async () => {
        set({ loading: true, error: null });
        try {
            const items = await inventoryService.getInventoryItems();
            set({ items, loading: false });
        } catch (error) {
            set({ error: "Error al cargar los items", loading: false });
        }
    },

    getInventoryItem: async (id: number) => {
        set({ loading: true, error: null });
        try {
            const item = await inventoryService.getInventoryItem(id);
            set({ loading: false });
            return item;
        } catch (error) {
            set({ error: "Error al cargar el item", loading: false });
            return null;
        }
    },

    createInventoryItem: async (data: RegisterFormValues) => {
        set({ loading: true, error: null });
        try {
            const result = await inventoryService.createInventoryItem(data);
            set({ loading: false });
            return { success: true, id: result.id };
        } catch (error) {
            set({ error: "Error al crear el item", loading: false });
            return { success: false };
        }
    },

    updateInventoryItem: async (id: number, data: RegisterFormValues) => {
        set({ loading: true, error: null });
        try {
            await inventoryService.updateInventoryItem(id, data);
            set({ loading: false });
            return { success: true };
        } catch (error) {
            set({ error: "Error al actualizar el item", loading: false });
            return { success: false };
        }
    },

    deleteInventoryItem: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await inventoryService.deleteInventoryItem(id);
            set({ loading: false });
            return true;
        } catch (error) {
            set({ error: "Error al eliminar el item", loading: false });
            return false;
        }
    },

    uploadItemImage: async (id: number, file: File) => {
        set({ loading: true, error: null });
        try {
            await inventoryService.uploadItemImage(id, file);
            set({ loading: false });
        } catch (error) {
            set({ error: "Error al subir la imagen", loading: false });
            throw error;
        }
    },
})); 
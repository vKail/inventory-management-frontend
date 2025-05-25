import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItemType, PaginatedItemTypes } from '../data/interfaces/item-type.interface';
import { itemTypeService } from '../services/item-type.service';

interface ItemTypeStore {
    itemTypes: ItemType[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getItemTypes: (page?: number, limit?: number) => Promise<void>;
    getItemTypeById: (itemTypeId: string) => Promise<ItemType | undefined>;
    addItemType: (itemType: Partial<ItemType>) => Promise<void>;
    updateItemType: (itemTypeId: string, itemType: Partial<ItemType>) => Promise<void>;
    deleteItemType: (itemTypeId: string) => Promise<void>;
}

const STORE_NAME = 'item-type-storage';

export const useItemTypeStore = create<ItemTypeStore>()(
    persist(
        (set, get) => ({
            itemTypes: [],
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            getItemTypes: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const response = await itemTypeService.getItemTypes(page, limit);
                    set({
                        itemTypes: response.records,
                        currentPage: response.page,
                        totalPages: response.pages,
                        loading: false,
                        error: null
                    });
                } catch (error) {
                    set({ error: 'Error al cargar los tipos de item', loading: false });
                    throw error;
                }
            },

            getItemTypeById: async (itemTypeId: string) => {
                try {
                    return await itemTypeService.getItemTypeById(itemTypeId);
                } catch {
                    set({ error: 'Error al cargar el tipo de item' });
                    return undefined;
                }
            },

            addItemType: async (itemType: Partial<ItemType>) => {
                try {
                    set({ loading: true, error: null });
                    await itemTypeService.createItemType(itemType as Omit<ItemType, 'id' | 'active'>);
                    await get().getItemTypes();
                    set({ loading: false });
                } catch (error) {
                    console.error('Error adding item type:', error);
                    set({
                        error: 'Error al crear el tipo de item',
                        loading: false
                    });
                    throw error;
                }
            },

            updateItemType: async (id: string, itemType: Partial<ItemType>) => {
                try {
                    set({ loading: true, error: null });
                    await itemTypeService.updateItemType(id, itemType);
                    await get().getItemTypes();
                    set({ loading: false });
                } catch (error) {
                    console.error('Error updating item type:', error);
                    set({
                        error: 'Error al actualizar el tipo de item',
                        loading: false
                    });
                    throw error;
                }
            },

            deleteItemType: async (itemTypeId: string) => {
                try {
                    set({ loading: true, error: null });
                    await itemTypeService.deleteItemType(itemTypeId);
                    const newItemTypes = get().itemTypes.filter(t => t.id !== itemTypeId);
                    set({ itemTypes: newItemTypes, loading: false });
                } catch (error) {
                    console.error('Error deleting item type:', error);
                    set({
                        error: 'Error al eliminar el tipo de item',
                        loading: false
                    });
                    throw error;
                }
            },
        }),
        {
            name: STORE_NAME,
        }
    )
); 
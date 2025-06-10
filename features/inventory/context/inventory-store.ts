import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InventoryItem, PaginatedInventoryResponse } from '../data/interfaces/inventory.interface';
import { InventoryService } from '../services/inventory.service';
import { IHttpResponse } from '@/core/data/interfaces/HttpHandler';

interface InventoryFilters {
    search?: string;
    categoryId?: string;
    statusId?: string;
    itemTypeId?: string;
    view?: 'table' | 'grid' | 'list';
}

interface InventoryState {
    items: InventoryItem[];
    selectedItem: InventoryItem | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    isEmpty: boolean;
    filters: InventoryFilters;
    getInventoryItems: (page?: number, limit?: number) => Promise<void>;
    getInventoryItem: (id: string) => Promise<InventoryItem | undefined>;
    getInventoryItemByCode: (code: string) => Promise<InventoryItem | null>;
    createInventoryItem: (data: FormData) => Promise<IHttpResponse<InventoryItem>>;
    updateInventoryItem: (id: string, data: Record<string, any>) => Promise<void>;
    deleteInventoryItem: (id: string) => Promise<void>;
    setSelectedItem: (item: InventoryItem | null) => void;
    setFilters: (filters: Partial<InventoryFilters>) => void;
    setPage: (page: number) => void;
    refreshTable: () => Promise<void>;
}

const STORE_NAME = 'inventory-storage';
const inventoryService = InventoryService.getInstance();

export const useInventoryStore = create<InventoryState>()(
    persist(
        (set, get) => ({
            items: [],
            selectedItem: null,
            loading: false,
            error: null,
            totalPages: 1,
            currentPage: 1,
            isEmpty: true,
            filters: {},

            setPage: (page: number) => {
                set({ currentPage: page });
                get().refreshTable();
            },

            setFilters: (newFilters) => {
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                    currentPage: 1
                }));
                get().refreshTable();
            },

            refreshTable: async () => {
                const { currentPage, filters } = get();
                await get().getInventoryItems(currentPage, 10);
            },

            getInventoryItems: async (page = 1, limit = 10) => {
                try {
                    set({ loading: true, error: null });
                    const { filters } = get();

                    // Construir query params
                    const queryParams = new URLSearchParams();
                    if (filters.search) queryParams.append('name', filters.search);
                    if (filters.categoryId && filters.categoryId !== 'all') queryParams.append('categoryId', filters.categoryId);
                    if (filters.statusId && filters.statusId !== 'all') queryParams.append('statusId', filters.statusId);
                    if (filters.itemTypeId && filters.itemTypeId !== 'all') queryParams.append('itemTypeId', filters.itemTypeId);

                    const response = await inventoryService.getInventoryItems(page, limit, queryParams.toString());

                    if (response.pages > 0 && page > response.pages) {
                        await get().getInventoryItems(1, limit);
                        return;
                    }

                    set({
                        items: response.records,
                        currentPage: response.page,
                        totalPages: response.pages,
                        isEmpty: response.records.length === 0,
                        loading: false,
                        error: response.records.length === 0 ? 'No hay items en el inventario. ¿Deseas crear el primer item?' : null
                    });
                } catch (error) {
                    console.error('Error fetching items:', error);
                    set({
                        error: 'Error al cargar los items',
                        loading: false,
                        isEmpty: true,
                        items: [],
                        currentPage: 1,
                        totalPages: 1
                    });
                }
            },

            getInventoryItem: async (id: string) => {
                try {
                    set({ loading: true, error: null });
                    const item = await inventoryService.getInventoryItemById(id);
                    if (item) {
                        set({ selectedItem: item, loading: false });
                        return item;
                    } else {
                        set({ error: 'Item no encontrado', loading: false });
                        return undefined;
                    }
                } catch (error) {
                    set({ error: 'Error al cargar el item', loading: false });
                    console.error('Error fetching item:', error);
                    return undefined;
                }
            },

            getInventoryItemByCode: async (code: string) => {
                try {
                    set({ loading: true, error: null });
                    const response = await inventoryService.getInventoryItemByCode(code);
                    set({ loading: false });
                    return response;
                } catch (error) {
                    set({ loading: false, error: 'Error al buscar el item' });
                    console.error('Error fetching item by code:', error);
                    return null;
                }
            },

            createInventoryItem: async (data: FormData) => {
                try {
                    set({ loading: true, error: null });
                    const response = await inventoryService.createInventoryItem(data);
                    // Después de crear, volvemos a la primera página
                    await get().getInventoryItems(1, 10);
                    set({ loading: false, isEmpty: false });
                    return response;
                } catch (error) {
                    set({ error: 'Error al crear el item', loading: false });
                    console.error('Error creating item:', error);
                    throw error;
                }
            },

            updateInventoryItem: async (id: string, data: Record<string, any>) => {
                try {
                    set({ loading: true, error: null });

                    // Separar las imágenes del resto de los datos
                    const { images, ...itemData } = data;

                    // Actualizar el item primero
                    await inventoryService.updateInventoryItem(id, itemData);

                    // Si hay imágenes nuevas, subirlas en una petición separada
                    if (images && images.length > 0) {
                        await inventoryService.addMultipleImagesToId(parseInt(id), images);
                    }

                    // Mantenemos la página actual después de actualizar
                    await get().refreshTable();
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

                    // Verificamos si necesitamos ajustar la página actual
                    const { currentPage, items } = get();
                    if (items.length === 1 && currentPage > 1) {
                        // Si es el último item de la página actual y no es la primera página
                        await get().getInventoryItems(currentPage - 1, 10);
                    } else {
                        // Refrescamos la página actual
                        await get().refreshTable();
                    }
                } catch (error) {
                    set({ error: 'Error al eliminar el item', loading: false });
                    console.error('Error deleting item:', error);
                    throw error;
                }
            },

            setSelectedItem: (item: InventoryItem | null) => {
                set({ selectedItem: item });
            }
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 
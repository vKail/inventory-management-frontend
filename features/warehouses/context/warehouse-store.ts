import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IWarehouse, IWarehouseResponse, PaginatedWarehouses } from "../data/interfaces/warehouse.interface";
import { WarehouseService } from "../services/warehouse.service";

interface WarehouseStore {
    warehouses: IWarehouseResponse[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getWarehouses: (page?: number, limit?: number) => Promise<void>;
    getWarehouseById: (warehouseId: number) => Promise<IWarehouseResponse | undefined>;
    addWarehouse: (warehouse: IWarehouse) => Promise<void>;
    updateWarehouse: (warehouseId: number, warehouse: IWarehouse) => Promise<void>;
    deleteWarehouse: (warehouseId: number) => Promise<void>;
    refreshTable: () => Promise<void>;
}

const STORE_NAME = 'warehouse';

export const useWarehouseStore = create<WarehouseStore>()(
    persist(
        (set, get) => ({
            warehouses: [],
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getWarehouses(currentPage, 10);
            },

            getWarehouses: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const data = await WarehouseService.getInstance().getWarehouses(page, limit);
                    set({
                        warehouses: data.records,
                        currentPage: data.page,
                        totalPages: data.pages,
                        error: null
                    });
                } catch (err: any) {
                    set({
                        error: "Error al cargar los almacenes",
                        warehouses: [],
                        currentPage: 1,
                        totalPages: 1
                    });
                } finally {
                    set({ loading: false });
                }
            },

            getWarehouseById: async (warehouseId: number) => {
                try {
                    return await WarehouseService.getInstance().getWarehouseById(warehouseId);
                } catch {
                    set({ error: "Error al cargar el almacén" });
                    return undefined;
                }
            },

            addWarehouse: async (warehouse: IWarehouse) => {
                set({ loading: true });
                try {
                    await WarehouseService.getInstance().createWarehouse(warehouse);
                    await get().getWarehouses(1, 10); // Reset to first page after adding
                } catch (error) {
                    set({ error: "Error al crear el almacén" });
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            updateWarehouse: async (warehouseId: number, warehouse: IWarehouse) => {
                set({ loading: true });
                try {
                    await WarehouseService.getInstance().updateWarehouse(warehouseId, warehouse);
                    await get().refreshTable(); // Stay on current page after update
                } catch (error) {
                    set({ error: "Error al actualizar el almacén" });
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            deleteWarehouse: async (warehouseId: number) => {
                set({ loading: true });
                try {
                    await WarehouseService.getInstance().deleteWarehouse(warehouseId);
                    const { currentPage, warehouses } = get();
                    if (warehouses.length === 1 && currentPage > 1) {
                        // Si es el último item de la página actual y no es la primera página
                        await get().getWarehouses(currentPage - 1, 10);
                    } else {
                        // Refrescamos la página actual
                        await get().refreshTable();
                    }
                } catch (error) {
                    set({ error: "Error al eliminar el almacén" });
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 
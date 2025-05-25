import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IColor, IColorResponse, PaginatedColors } from "../data/interfaces/color.interface";
import { ColorService } from "../services/color.service";

interface ColorStore {
    colors: IColorResponse[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getColors: (page?: number, limit?: number) => Promise<void>;
    getColorById: (colorId: number) => Promise<IColorResponse | undefined>;
    addColor: (color: IColor) => Promise<void>;
    updateColor: (colorId: number, color: IColor) => Promise<void>;
    deleteColor: (colorId: number) => Promise<void>;
    refreshTable: () => Promise<void>;
}

const STORE_NAME = 'color';

export const useColorStore = create<ColorStore>()(
    persist(
        (set, get) => ({
            colors: [],
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getColors(currentPage, 10);
            },

            getColors: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const data = await ColorService.getInstance().getColors(page, limit);
                    set({
                        colors: data.records,
                        currentPage: data.page,
                        totalPages: data.pages,
                        error: null
                    });
                } catch (err: any) {
                    set({
                        error: "Error al cargar los colores",
                        colors: [],
                        currentPage: 1,
                        totalPages: 1
                    });
                } finally {
                    set({ loading: false });
                }
            },

            getColorById: async (colorId: number) => {
                try {
                    return await ColorService.getInstance().getColorById(colorId);
                } catch {
                    set({ error: "Error al cargar el color" });
                    return undefined;
                }
            },

            addColor: async (color: IColor) => {
                set({ loading: true });
                try {
                    await ColorService.getInstance().createColor(color);
                    await get().getColors(1, 10); // Reset to first page after adding
                } catch (error) {
                    set({ error: "Error al crear el color" });
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            updateColor: async (colorId: number, color: IColor) => {
                set({ loading: true });
                try {
                    await ColorService.getInstance().updateColor(colorId, color);
                    await get().refreshTable(); // Stay on current page after update
                } catch (error) {
                    set({ error: "Error al actualizar el color" });
                    throw error;
                } finally {
                    set({ loading: false });
                }
            },

            deleteColor: async (colorId: number) => {
                set({ loading: true });
                try {
                    await ColorService.getInstance().deleteColor(colorId);
                    const { currentPage, colors } = get();
                    if (colors.length === 1 && currentPage > 1) {
                        // Si es el último item de la página actual y no es la primera página
                        await get().getColors(currentPage - 1, 10);
                    } else {
                        // Refrescamos la página actual
                        await get().refreshTable();
                    }
                } catch (error) {
                    set({ error: "Error al eliminar el color" });
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

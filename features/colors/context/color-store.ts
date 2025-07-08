import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IColor, IColorResponse, PaginatedColors } from "../data/interfaces/color.interface";
import { ColorService } from "../services/color.service";

interface ColorStore {
    colors: IColorResponse[];
    allColors: IColorResponse[]; // Nuevo estado para todos los colores
    filteredColors: IColorResponse[];
    searchTerm: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getColors: (page?: number, limit?: number, options?: { allRecords?: boolean, search?: string }) => Promise<void>;
    getAllColors: () => Promise<void>; // Nueva función específica para cargar todos
    getColorById: (colorId: number) => Promise<IColorResponse | undefined>;
    addColor: (color: IColor) => Promise<void>;
    updateColor: (colorId: number, color: IColor) => Promise<void>;
    deleteColor: (colorId: number) => Promise<void>;
    refreshTable: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    clearFilters: () => void;
}

const STORE_NAME = 'color';

export const useColorStore = create<ColorStore>()(
    persist(
        (set, get) => ({
            colors: [],
            allColors: [], // Nuevo estado para todos los colores
            filteredColors: [],
            searchTerm: '',
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: async (term: string) => {
                set({ searchTerm: term, loading: true });
                try {
                    await get().getColors(1, 10, { search: term });
                } finally {
                    set({ loading: false });
                }
            },

            clearFilters: async () => {
                set({ searchTerm: '', loading: true });
                try {
                    await get().getColors(1, 10); // Recargar sin filtros
                } finally {
                    set({ loading: false });
                }
            },

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getColors(currentPage, 10);
            },

            getColors: async (page = 1, limit = 10, options?: { allRecords?: boolean, search?: string }) => {
                set({ loading: true });
                try {
                    const searchTerm = options?.search ?? get().searchTerm;
                    const allRecords = options?.allRecords ?? false;
                    console.log('🎨 ColorStore - Fetching colors with:', { page, limit, searchTerm, allRecords });

                    const data = await ColorService.getInstance().getColors(page, limit, searchTerm, allRecords);
                    console.log('🎨 ColorStore - Received colors:', data.records.length, 'total:', data.total);

                    set({
                        colors: data.records,
                        filteredColors: data.records,
                        currentPage: data.page,
                        totalPages: data.pages,
                        loading: false,
                        error: null
                    });
                } catch (err: any) {
                    console.error('❌ ColorStore - Error:', err);
                    set({
                        error: "Error al cargar los colores",
                        colors: [],
                        filteredColors: [],
                        currentPage: 1,
                        totalPages: 1,
                        loading: false
                    });
                }
            },

            getAllColors: async () => {
                set({ loading: true });
                try {
                    console.log('🎨 ColorStore - Loading ALL colors...');
                    const data = await ColorService.getInstance().getColors(1, 10000, '', true);
                    console.log('🎨 ColorStore - Received ALL colors:', data.records.length, 'total:', data.total);

                    set({
                        allColors: data.records, // Guardar en allColors, NO en colors
                        loading: false,
                        error: null
                    });
                } catch (err: any) {
                    console.error('❌ ColorStore - Error loading all colors:', err);
                    set({
                        error: "Error al cargar todos los colores",
                        allColors: [],
                        loading: false
                    });
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

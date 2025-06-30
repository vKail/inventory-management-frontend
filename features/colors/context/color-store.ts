import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IColor, IColorResponse, PaginatedColors } from "../data/interfaces/color.interface";
import { ColorService } from "../services/color.service";

interface ColorStore {
    colors: IColorResponse[];
    filteredColors: IColorResponse[];
    searchTerm: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getColors: (page?: number, limit?: number, options?: { allRecords?: boolean }) => Promise<void>;
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
            filteredColors: [],
            searchTerm: '',
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: (term: string) => {
                const { colors } = get();
                const filtered = colors.filter((color) => {
                    const matchesSearch = color.name.toLowerCase().includes(term.toLowerCase()) ||
                        color.hexCode.toLowerCase().includes(term.toLowerCase()) ||
                        color.description?.toLowerCase().includes(term.toLowerCase());

                    return matchesSearch;
                });
                set({ searchTerm: term, filteredColors: filtered });
            },

            clearFilters: () => {
                const { colors } = get();
                set({
                    searchTerm: '',
                    filteredColors: colors
                });
            },

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getColors(currentPage, 10);
            },

            getColors: async (page = 1, limit = 10, options?: { allRecords?: boolean }) => {
                set({ loading: true });
                try {
                    const data = await ColorService.getInstance().getColors(page, limit);

                    if (data.pages > 0 && page > data.pages) {
                        await get().getColors(1, limit);
                        return;
                    }

                    const { searchTerm } = get();
                    const allColors = data.records;

                    const filtered = allColors.filter((color) => {
                        const matchesSearch = searchTerm === '' ||
                            color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            color.hexCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            color.description?.toLowerCase().includes(searchTerm.toLowerCase());

                        return matchesSearch;
                    });

                    set({
                        colors: allColors,
                        filteredColors: filtered,
                        currentPage: data.page,
                        totalPages: data.pages,
                        loading: false,
                        error: null
                    });
                } catch (err: any) {
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

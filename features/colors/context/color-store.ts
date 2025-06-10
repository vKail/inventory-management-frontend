import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IColor, IColorResponse, PaginatedColors } from "../data/interfaces/color.interface";
import { ColorService } from "../services/color.service";

//Interface for the color store
// This interface defines the structure of the color store, including the state and actions available for managing colors.
interface ColorFilters {
    name?: string;
    hexCode?: string;
    description?: string;
}

interface ColorStore {
    colors: IColorResponse[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    filters: ColorFilters;
    setFilters: (filters: ColorFilters) => void;
    getColors: (page?: number, limit?: number, filters?: ColorFilters) => Promise<void>;
    getColorById: (colorId: number) => Promise<IColorResponse | undefined>;
    addColor: (color: IColor) => Promise<void>;
    updateColor: (colorId: number, color: IColor) => Promise<void>;
    deleteColor: (colorId: number) => Promise<void>;
    refreshTable: () => Promise<void>;
}

// This store manages the state of colors, including fetching, adding, updating, and deleting colors.
const STORE_NAME = 'color';

// The useColorStore hook provides access to the color store, allowing components to interact with the color data and actions.
// It uses Zustand for state management and persists the state in session storage.
export const useColorStore = create<ColorStore>()(
    persist(
        (set, get) => ({
            colors: [],
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,
            filters: {},
            setFilters: (filters: ColorFilters) => set({ filters }),
            refreshTable: async () => {
                const { currentPage, filters } = get();
                await get().getColors(currentPage, 10, filters);
            },


            // This function retrieves a paginated list of colors.
            // It uses the ColorService to fetch the colors and handles loading and error states.
            getColors: async (page = 1, limit = 10, filters?: ColorFilters) => {
                set({ loading: true });
                try {
                    const data = await ColorService.getInstance().getColors(page, limit, filters ?? get().filters);
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

            //This function retrieves a color by its ID.
            // It uses the ColorService to fetch the color data and handles errors appropriately.
            getColorById: async (colorId: number) => {
                try {

                    return await ColorService.getInstance().getColorById(colorId);
                } catch {
                    set({ error: "Error al cargar el color" });
                    return undefined;
                }
            },

            // This function adds a new color.
            // It uses the ColorService to create the color and refreshes the color list after adding.
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


            // This function updates an existing color.
            // It uses the ColorService to update the color and refreshes the current page after updating.
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


            // This function deletes a color by its ID.
            // It uses the ColorService to delete the color and refreshes the color list after deletion.
            deleteColor: async (colorId: number) => {
                set({ loading: true });
                try {
                    await ColorService.getInstance().deleteColor(colorId);
                    const { currentPage, colors } = get();
                    if (colors.length === 1 && currentPage > 1) {
                        // If the last color on the current page was deleted, go to the previous page
                        await get().getColors(currentPage - 1, 10);
                    } else {
                        // Refresh the current page to reflect the deletion
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
            // Persist the color store in session storage
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

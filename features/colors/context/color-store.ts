import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IColor, IColorResponse, PaginatedColors } from "../data/interfaces/color.interface";
import { ColorService } from "../services/color.service";

interface ColorStore {
    colors: IColorResponse[];
    loading: boolean;
    error: string | null;
    getColors: (page?: number, limit?: number) => Promise<PaginatedColors | undefined>;
    getColorById: (colorId: number) => Promise<IColorResponse | undefined>;
    addColor: (color: IColor) => Promise<void>;
    updateColor: (colorId: number, color: IColor) => Promise<void>;
    deleteColor: (colorId: number) => Promise<void>;
}

const STORE_NAME = 'color';

export const useColorStore = create<ColorStore>()(
    persist(
        (set, get) => ({
            colors: [],
            loading: false,
            error: null,

            getColors: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const data = await ColorService.getInstance().getColors(page, limit);
                    set({ colors: data.records, error: null });
                    return data;
                } catch (err: any) {
                    set({ error: "Error al cargar los colores" });
                    return undefined;
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
                await ColorService.getInstance().createColor(color);
                await get().getColors(); 
            },

            updateColor: async (colorId: number, color: IColor) => {
                await ColorService.getInstance().updateColor(colorId, color);
                await get().getColors();
            },

            deleteColor: async (colorId: number) => {
                await ColorService.getInstance().deleteColor(colorId);
                const newColors = get().colors.filter(c => c.id !== colorId);
                set({ colors: newColors });
            },
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

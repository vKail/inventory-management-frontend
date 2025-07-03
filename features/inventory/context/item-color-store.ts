import { create } from 'zustand';
import { ItemColor } from '../data/interfaces/inventory.interface';
import { ItemColorService } from '../services/item-color.service';

/**
 * Store para manejar la edición de colores de un item de inventario.
 * Permite guardar la lista original (pre-edición) y la lista actual (modificada por el usuario),
 * y provee métodos para sincronizar los cambios con el backend.
 */
interface ItemColorState {
    /** Lista original de colores del item (tal como viene del backend) */
    originalColors: ItemColor[];
    /** Lista actual de colores seleccionados (modificada por el usuario) */
    currentColors: ItemColor[];
    /** Cargar la lista original y setear la actual igual (al iniciar edición) */
    setColors: (colors: ItemColor[]) => void;
    /** Actualizar la lista actual (por el drag and drop) */
    updateCurrentColors: (colors: ItemColor[]) => void;
    /** Sincronizar cambios con el backend (POST, DELETE, PATCH según corresponda) */
    syncColors: (itemId: number) => Promise<void>;
    /** Limpiar el store (al salir del formulario) */
    clear: () => void;
}

const itemColorService = ItemColorService.getInstance();

export const useItemColorStore = create<ItemColorState>((set, get) => ({
    originalColors: [],
    currentColors: [],

    setColors: (colors) => {
        set({ originalColors: colors, currentColors: colors });
    },

    updateCurrentColors: (colors) => {
        set({ currentColors: colors });
    },

    /**
     * Sincroniza los cambios de colores con el backend:
     * - Elimina los que estaban y ya no están
     * - Agrega los nuevos
     * (No actualiza los que siguen igual)
     * Ejecuta en serie para mejor trazabilidad.
     */
    syncColors: async (itemId) => {
        console.log("LLEGA AQUI")
        const { originalColors, currentColors } = get();
        // 1. Eliminar los que estaban y ya no están
        const toDelete = originalColors.filter(
            (orig) => !currentColors.some((cur) => cur.colorId === orig.colorId)
        );
        // 2. Agregar los nuevos
        const toAdd = currentColors.filter(
            (cur) => !originalColors.some((orig) => orig.colorId === cur.colorId)
        );
        // Eliminar relaciones removidas
        for (const col of toDelete) {
            console.log('[ItemColor] Eliminando relación:', col);
            await itemColorService.removeColorFromItem(col.id);
        }
        // Agregar nuevas relaciones
        for (const col of toAdd) {
            console.log('[ItemColor] Creando relación:', { itemId, colorId: col.colorId });
            await itemColorService.addColorToItem({
                itemId,
                colorId: col.colorId,
                isMainColor: col.isMainColor,
            });
        }
        // Al finalizar, refrescar la lista original
        set({ originalColors: [...get().currentColors] });
    },

    clear: () => set({ originalColors: [], currentColors: [] }),
})); 
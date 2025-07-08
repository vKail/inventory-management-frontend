import { create } from 'zustand';
import { ItemMaterial } from '../data/interfaces/inventory.interface';
import { ItemMaterialService } from '../services/item-material.service';

/**
 * Store para manejar la edición de materiales de un item de inventario.
 * Permite guardar la lista original (pre-edición) y la lista actual (modificada por el usuario),
 * y provee métodos para sincronizar los cambios con el backend.
 */
interface ItemMaterialState {
    /** Lista original de materiales del item (tal como viene del backend) */
    originalMaterials: ItemMaterial[];
    /** Lista actual de materiales seleccionados (modificada por el usuario) */
    currentMaterials: ItemMaterial[];
    /** Cargar la lista original y setear la actual igual (al iniciar edición) */
    setMaterials: (materials: ItemMaterial[]) => void;
    /** Actualizar la lista actual (por el drag and drop) */
    updateCurrentMaterials: (materials: ItemMaterial[]) => void;
    /** Sincronizar cambios con el backend (POST, DELETE, PATCH según corresponda) */
    syncMaterials: (itemId: number) => Promise<void>;
    /** Limpiar el store (al salir del formulario) */
    clear: () => void;
}

const itemMaterialService = ItemMaterialService.getInstance();

export const useItemMaterialStore = create<ItemMaterialState>((set, get) => ({
    originalMaterials: [],
    currentMaterials: [],

    setMaterials: (materials) => {
        set({ originalMaterials: materials, currentMaterials: materials });
    },

    updateCurrentMaterials: (materials) => {
        set({ currentMaterials: materials });
    },

    /**
     * Sincroniza los cambios de materiales con el backend:
     * - Elimina los que estaban y ya no están
     * - Agrega los nuevos
     * (No actualiza los que siguen igual)
     * Ejecuta en serie para mejor trazabilidad.
     */
    syncMaterials: async (itemId) => {
        const { originalMaterials, currentMaterials } = get();
        // 1. Eliminar los que estaban y ya no están
        const toDelete = originalMaterials.filter(
            (orig) => !currentMaterials.some((cur) => cur.materialId === orig.materialId)
        );
        // 2. Agregar los nuevos
        const toAdd = currentMaterials.filter(
            (cur) => !originalMaterials.some((orig) => orig.materialId === cur.materialId)
        );
        // Eliminar relaciones removidas
        for (const mat of toDelete) {
            await itemMaterialService.removeItemMaterial(mat.id);
        }
        // Agregar nuevas relaciones
        for (const mat of toAdd) {
            await itemMaterialService.addMaterialToItem({
                itemId,
                materialId: mat.materialId,
                isMainMaterial: mat.isMainMaterial,
            });
        }
        // Al finalizar, refrescar la lista original
        set({ originalMaterials: [...get().currentMaterials] });
    },

    clear: () => set({ originalMaterials: [], currentMaterials: [] }),
})); 
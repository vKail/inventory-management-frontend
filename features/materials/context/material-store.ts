import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IMaterial, PaginatedMaterials } from '../data/interfaces/material.interface';
import { MaterialService } from '../services/material.service';

interface MaterialState {
    materials: IMaterial[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getMaterials: (page?: number, limit?: number) => Promise<void>;
    getMaterialById: (materialId: number) => Promise<IMaterial | undefined>;
    addMaterial: (material: Partial<IMaterial>) => Promise<void>;
    updateMaterial: (materialId: number, material: Partial<IMaterial>) => Promise<void>;
    deleteMaterial: (materialId: number) => Promise<void>;
}

const STORE_NAME = 'material-storage';

export const useMaterialStore = create<MaterialState>()(
    persist(
        (set, get) => ({
            materials: [],
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            getMaterials: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const response = await MaterialService.getInstance().getMaterials(page, limit);
                    set({
                        materials: response.records,
                        currentPage: response.page,
                        totalPages: response.pages,
                        loading: false,
                        error: null
                    });
                } catch (error) {
                    set({ error: 'Error al cargar los materiales', loading: false });
                    throw error;
                }
            },

            getMaterialById: async (materialId: number) => {
                try {
                    return await MaterialService.getInstance().getMaterialById(materialId);
                } catch {
                    set({ error: 'Error al cargar el material' });
                    return undefined;
                }
            },

            addMaterial: async (material: Partial<IMaterial>) => {
                try {
                    set({ loading: true, error: null });
                    await MaterialService.getInstance().createMaterial(material);
                    await get().getMaterials();
                    set({ loading: false });
                } catch (error) {
                    console.error('Error adding material:', error);
                    set({
                        error: 'Error al crear el material',
                        loading: false
                    });
                    throw error;
                }
            },

            updateMaterial: async (id: number, material: Partial<IMaterial>) => {
                try {
                    set({ loading: true, error: null });
                    await MaterialService.getInstance().updateMaterial(id, material);
                    await get().getMaterials();
                    set({ loading: false });
                } catch (error) {
                    console.error('Error updating material:', error);
                    set({
                        error: 'Error al actualizar el material',
                        loading: false
                    });
                    throw error;
                }
            },

            deleteMaterial: async (materialId: number) => {
                try {
                    set({ loading: true, error: null });
                    await MaterialService.getInstance().deleteMaterial(materialId);
                    const newMaterials = get().materials.filter(m => m.id !== materialId);
                    set({ materials: newMaterials, loading: false });
                } catch (error) {
                    console.error('Error deleting material:', error);
                    set({
                        error: 'Error al eliminar el material',
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
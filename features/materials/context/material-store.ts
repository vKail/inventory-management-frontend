import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IMaterial } from '../data/interfaces/material.interface';
import { MaterialService } from '../services/material.service';

// Mapeo de tipos del backend a tipos del frontend
const normalizeMaterialType = (type: string): string => {
    const normalized = type.toUpperCase().trim();

    // Mapeo de variaciones del backend
    const typeMapping: { [key: string]: string } = {
        'METAL': 'METAL',
        'OTRO': 'OTHER',
        'PLÁSTICO': 'OTHER',
        'PLASTICO': 'OTHER',
        'CONSUMABLE': 'CONSUMABLE',
        'TOOL': 'TOOL',
        'EQUIPMENT': 'EQUIPMENT',
        'DELICATE': 'DELICATE',
    };

    return typeMapping[normalized] || 'OTHER';
};

interface MaterialState {
    materials: IMaterial[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    searchTerm: string;
    typeFilter: string;
    refreshTable: () => Promise<void>;
    getMaterials: (page?: number, limit?: number) => Promise<void>;
    getMaterialById: (materialId: number) => Promise<IMaterial | undefined>;
    addMaterial: (material: Partial<IMaterial>) => Promise<void>;
    updateMaterial: (materialId: number, material: Partial<IMaterial>) => Promise<void>;
    deleteMaterial: (materialId: number) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setTypeFilter: (type: string) => void;
    clearFilters: () => void;
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
            searchTerm: '',
            typeFilter: 'all',

            setSearchTerm: (term: string) => {
                set({ searchTerm: term });
                // Trigger a new API call with the updated search term
                get().getMaterials(1, 10);
            },

            setTypeFilter: (type: string) => {
                set({ typeFilter: type });
                // Trigger a new API call with the updated type filter
                get().getMaterials(1, 10);
            },

            clearFilters: () => {
                set({
                    searchTerm: '',
                    typeFilter: 'all'
                });
                // Trigger a new API call without filters
                get().getMaterials(1, 10);
            },

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getMaterials(currentPage, 10);
            },

            getMaterials: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const { searchTerm, typeFilter } = get();

                    // Prepare filters for backend
                    const filters: { name?: string; materialType?: string } = {};

                    if (searchTerm && searchTerm.trim() !== '') {
                        filters.name = searchTerm.trim();
                    }

                    if (typeFilter && typeFilter !== 'all') {
                        filters.materialType = typeFilter;
                    }

                    const response = await MaterialService.getInstance().getMaterials(page, limit, filters);

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
                    await get().getMaterials(1, 10); // Reset to first page after adding
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
                    await get().getMaterials(get().currentPage, 10); // Stay on current page after update
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
                    const { currentPage, materials } = get();
                    if (materials.length === 1 && currentPage > 1) {
                        // Si es el último item de la página actual y no es la primera página
                        await get().getMaterials(currentPage - 1, 10);
                    } else {
                        // Refrescamos la página actual
                        await get().refreshTable();
                    }
                    set({ loading: false });
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
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
        'PLÁSTICO': 'PLASTIC',
        'PLASTICO': 'PLASTIC',
        'CONSUMABLE': 'CONSUMABLE',
        'TOOL': 'TOOL',
        'EQUIPMENT': 'EQUIPMENT',
        'DELICATE': 'DELICATE',
    };

    return typeMapping[normalized] || 'OTHER';
};

interface MaterialState {
    materials: IMaterial[];
    filteredMaterials: IMaterial[];
    searchTerm: string;
    typeFilter: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
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
            filteredMaterials: [],
            searchTerm: '',
            typeFilter: 'all',
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: (term: string) => {
                const { materials, typeFilter } = get();
                const filtered = materials.filter((material) => {
                    const matchesSearch = material.name.toLowerCase().includes(term.toLowerCase()) ||
                        material.description.toLowerCase().includes(term.toLowerCase());

                    const matchesType = typeFilter === 'all' || normalizeMaterialType(material.materialType) === typeFilter;

                    return matchesSearch && matchesType;
                });
                set({ searchTerm: term, filteredMaterials: filtered });
            },

            setTypeFilter: (type: string) => {
                const { materials, searchTerm } = get();
                const filtered = materials.filter((material) => {
                    const matchesSearch = searchTerm === '' ||
                        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        material.description.toLowerCase().includes(searchTerm.toLowerCase());

                    const matchesType = type === 'all' || normalizeMaterialType(material.materialType) === type;

                    return matchesSearch && matchesType;
                });
                set({ typeFilter: type, filteredMaterials: filtered });
            },

            clearFilters: () => {
                const { materials } = get();
                set({
                    searchTerm: '',
                    typeFilter: 'all',
                    filteredMaterials: materials
                });
            },

            getMaterials: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const response = await MaterialService.getInstance().getMaterials(page, limit);
                    const { searchTerm, typeFilter } = get();
                    const allMaterials = response.records;

                    const filtered = allMaterials.filter((material) => {
                        const matchesSearch = searchTerm === '' ||
                            material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            material.description.toLowerCase().includes(searchTerm.toLowerCase());

                        const matchesType = typeFilter === 'all' || normalizeMaterialType(material.materialType) === typeFilter;

                        return matchesSearch && matchesType;
                    });

                    set({
                        materials: allMaterials,
                        filteredMaterials: filtered,
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
                        await get().getMaterials(currentPage, 10);
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
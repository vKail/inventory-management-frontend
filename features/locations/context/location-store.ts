import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ILocation, PaginatedLocations } from '../data/interfaces/location.interface';
import { LocationFormValues } from '../data/schemas/location.schema';
import { LocationService } from '../services/location.service';

interface LocationStore {
    locations: ILocation[];
    filteredLocations: ILocation[];
    searchTerm: string;
    typeFilter: string;
    isLoading: {
        fetch: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    };
    error: string | null;
    currentPage: number;
    totalPages: number;
    getLocations: (page?: number, limit?: number, search?: string, type?: string) => Promise<void>;
    getLocationById: (locationId: number) => Promise<ILocation | undefined>;
    addLocation: (location: LocationFormValues) => Promise<void>;
    updateLocation: (locationId: number, location: LocationFormValues) => Promise<void>;
    deleteLocation: (locationId: number) => Promise<void>;
    setSearchTerm: (term: string) => void;
    setTypeFilter: (type: string) => void;
    clearFilters: () => void;
    loading: boolean;
}

const STORE_NAME = 'location-storage';

export const useLocationStore = create<LocationStore>()(
    persist(
        (set, get) => ({
            locations: [],
            filteredLocations: [],
            searchTerm: '',
            typeFilter: 'all',
            isLoading: {
                fetch: false,
                create: false,
                update: false,
                delete: false
            },
            error: null,
            currentPage: 1,
            totalPages: 1,
            loading: false,

            setSearchTerm: (term: string) => {
                set({ searchTerm: term });
                // Trigger backend search
                get().getLocations(1, 10, term, get().typeFilter);
            },

            setTypeFilter: (type: string) => {
                set({ typeFilter: type });
                // Trigger backend filter
                get().getLocations(1, 10, get().searchTerm, type);
            },

            clearFilters: () => {
                set({
                    searchTerm: '',
                    typeFilter: 'all'
                });
                // Reset to first page with no filters
                get().getLocations(1, 10);
            },

            getLocations: async (page = 1, limit = 10, search = '', type = 'all') => {
                set(state => ({ isLoading: { ...state.isLoading, fetch: true } }));
                try {
                    // Build query parameters for backend filtering
                    const filters: { name?: string; type?: string } = {};
                    if (search && search.trim()) {
                        filters.name = search.trim();
                    }
                    if (type && type !== 'all') {
                        filters.type = type;
                    }

                    const response = await LocationService.getInstance().getLocations(page, limit, filters);
                    if (response && response.records) {
                        set({
                            locations: response.records,
                            filteredLocations: response.records,
                            currentPage: response.page,
                            totalPages: Math.ceil(response.total / limit),
                            isLoading: { ...get().isLoading, fetch: false },
                            error: null
                        });
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    set(state => ({
                        error: 'Error al cargar las ubicaciones',
                        isLoading: { ...state.isLoading, fetch: false },
                        locations: [],
                        filteredLocations: []
                    }));
                    throw error;
                }
            },

            getLocationById: async (locationId: number) => {
                try {
                    return await LocationService.getInstance().getLocationById(locationId);
                } catch {
                    set({ error: 'Error al cargar la ubicación' });
                    return undefined;
                }
            },

            addLocation: async (location: LocationFormValues) => {
                set(state => ({ isLoading: { ...state.isLoading, create: true }, error: null }));
                try {
                    // Convert form data to full location data
                    const fullLocation: Omit<ILocation, 'id' | 'createdAt' | 'updatedAt'> = {
                        ...location,
                        floor: location.floor || '', // Ensure floor is always a string
                        notes: location.notes || '', // Ensure notes is always a string
                        qrCode: '', // Default empty values for backend-only fields
                        coordinates: ''
                    };
                    await LocationService.getInstance().createLocation(fullLocation);
                    // Refresh with current filters
                    await get().getLocations(1, 10, get().searchTerm, get().typeFilter);
                    set(state => ({ isLoading: { ...state.isLoading, create: false } }));
                } catch (error) {
                    console.error('Error adding location:', error);
                    set(state => ({
                        error: 'Error al crear la ubicación',
                        isLoading: { ...state.isLoading, create: false }
                    }));
                    throw error;
                }
            },

            updateLocation: async (id: number, location: LocationFormValues) => {
                set(state => ({ isLoading: { ...state.isLoading, update: true }, error: null }));
                try {
                    // Convert form data to partial location data
                    const partialLocation: Partial<ILocation> = {
                        ...location,
                        floor: location.floor || '', // Ensure floor is always a string
                        notes: location.notes || '', // Ensure notes is always a string
                        qrCode: '', // Default empty values for backend-only fields
                        coordinates: ''
                    };
                    await LocationService.getInstance().updateLocation(id, partialLocation);
                    // Refresh with current filters
                    await get().getLocations(get().currentPage, 10, get().searchTerm, get().typeFilter);
                    set(state => ({ isLoading: { ...state.isLoading, update: false } }));
                } catch (error) {
                    console.error('Error updating location:', error);
                    set(state => ({
                        error: 'Error al actualizar la ubicación',
                        isLoading: { ...state.isLoading, update: false }
                    }));
                    throw error;
                }
            },

            deleteLocation: async (locationId: number) => {
                set(state => ({ isLoading: { ...state.isLoading, delete: true }, error: null }));
                try {
                    await LocationService.getInstance().deleteLocation(locationId);
                    const { currentPage, locations } = get();
                    if (locations.length === 1 && currentPage > 1) {
                        // Si es el último item de la página actual y no es la primera página
                        await get().getLocations(currentPage - 1, 10, get().searchTerm, get().typeFilter);
                    } else {
                        // Refrescamos la página actual
                        await get().getLocations(currentPage, 10, get().searchTerm, get().typeFilter);
                    }
                    set(state => ({ isLoading: { ...state.isLoading, delete: false } }));
                } catch (error) {
                    console.error('Error deleting location:', error);
                    set(state => ({
                        error: 'Error al eliminar la ubicación',
                        isLoading: { ...state.isLoading, delete: false }
                    }));
                    throw error;
                }
            },
        }),
        {
            name: STORE_NAME,
        }
    )
);

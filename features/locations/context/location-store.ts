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
    getLocations: (page?: number, limit?: number) => Promise<void>;
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
                const { locations, typeFilter } = get();
                const filtered = locations.filter((location) => {
                    const matchesSearch = location.name.toLowerCase().includes(term.toLowerCase()) ||
                        location.description.toLowerCase().includes(term.toLowerCase()) ||
                        location.floor.toLowerCase().includes(term.toLowerCase()) ||
                        location.reference.toLowerCase().includes(term.toLowerCase());

                    const matchesType = typeFilter === 'all' || location.type === typeFilter;

                    return matchesSearch && matchesType;
                });
                set({ searchTerm: term, filteredLocations: filtered });
            },

            setTypeFilter: (type: string) => {
                const { locations, searchTerm } = get();
                const filtered = locations.filter((location) => {
                    const matchesSearch = searchTerm === '' ||
                        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        location.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        location.reference.toLowerCase().includes(searchTerm.toLowerCase());

                    const matchesType = type === 'all' || location.type === type;

                    return matchesSearch && matchesType;
                });
                set({ typeFilter: type, filteredLocations: filtered });
            },

            clearFilters: () => {
                const { locations } = get();
                set({
                    searchTerm: '',
                    typeFilter: 'all',
                    filteredLocations: locations
                });
            },

            getLocations: async (page = 1, limit = 10) => {
                set(state => ({ isLoading: { ...state.isLoading, fetch: true } }));
                try {
                    const response = await LocationService.getInstance().getLocations(page, limit);
                    if (response && response.records) {
                        const { searchTerm, typeFilter } = get();
                        const allLocations = response.records;

                        const filtered = allLocations.filter((location) => {
                            const matchesSearch = searchTerm === '' ||
                                location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                location.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                location.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                location.reference.toLowerCase().includes(searchTerm.toLowerCase());

                            const matchesType = typeFilter === 'all' || location.type === typeFilter;

                            return matchesSearch && matchesType;
                        });

                        set({
                            locations: allLocations,
                            filteredLocations: filtered,
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
                    await get().getLocations(1, 10); // Reset to first page after adding
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
                    await get().getLocations(get().currentPage, 10); // Stay on current page after update
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
                        await get().getLocations(currentPage - 1, 10);
                    } else {
                        // Refrescamos la página actual
                        await get().getLocations(currentPage, 10);
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

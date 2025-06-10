import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ILocation, PaginatedLocations } from '../data/interfaces/location.interface';
import { LocationService } from '../services/location.service';

interface LocationStore {
    locations: ILocation[];
    isLoading: {
        fetch: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    };
    error: string | null;
    getLocations: (page?: number, limit?: number, filters?: { name?: string; description?: string; type?: string; floor?: string; reference?: string }) => Promise<PaginatedLocations>;
    getLocationById: (locationId: number) => Promise<ILocation | undefined>;
    addLocation: (location: Omit<ILocation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateLocation: (locationId: number, location: Partial<ILocation>) => Promise<void>;
    deleteLocation: (locationId: number) => Promise<void>;
    loading: boolean;
}

const STORE_NAME = 'location-storage';

export const useLocationStore = create<LocationStore>()(
    persist(
        (set, get) => ({
            locations: [],
            isLoading: {
                fetch: false,
                create: false,
                update: false,
                delete: false
            },
            error: null,
            loading: false,

            getLocations: async (page = 1, limit = 10, filters) => {
                set(state => ({ isLoading: { ...state.isLoading, fetch: true } }));
                try {
                    const response = await LocationService.getInstance().getLocations(page, limit, filters);
                    if (response && response.records) {
                        set({
                            locations: response.records,
                            isLoading: { ...get().isLoading, fetch: false },
                            error: null
                        });
                        return response;
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    set(state => ({
                        error: 'Error al cargar las ubicaciones',
                        isLoading: { ...state.isLoading, fetch: false },
                        locations: []
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

            addLocation: async (location: Omit<ILocation, 'id' | 'createdAt' | 'updatedAt'>) => {
                set(state => ({ isLoading: { ...state.isLoading, create: true }, error: null }));
                try {
                    await LocationService.getInstance().createLocation(location);
                    await get().getLocations();
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

            updateLocation: async (id: number, location: Partial<ILocation>) => {
                set(state => ({ isLoading: { ...state.isLoading, update: true }, error: null }));
                try {
                    await LocationService.getInstance().updateLocation(id, location);
                    await get().getLocations();
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
                    const newLocations = get().locations.filter(l => l.id !== locationId);
                    set(state => ({
                        locations: newLocations,
                        isLoading: { ...state.isLoading, delete: false }
                    }));
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

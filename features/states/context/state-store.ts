import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IState, PaginatedResponse } from '../data/interfaces/state.interface';
import { StateService } from '../services/state.service';

interface StateStore {
    states: IState[];
    filteredStates: IState[];
    searchTerm: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getStates: (page?: number, limit?: number) => Promise<PaginatedResponse<IState>>;
    getStateById: (stateId: number) => Promise<IState | undefined>;
    addState: (state: Partial<IState>) => Promise<void>;
    updateState: (stateId: number, state: Partial<IState>) => Promise<void>;
    deleteState: (stateId: number) => Promise<void>;
    setSearchTerm: (term: string) => void;
    clearFilters: () => void;
}

const STORE_NAME = 'state-storage';

export const useStateStore = create<StateStore>()(
    persist(
        (set, get) => ({
            states: [],
            filteredStates: [],
            searchTerm: '',
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: (term: string) => {
                const { states } = get();
                const filtered = states.filter((state) => {
                    const matchesSearch = state.name.toLowerCase().includes(term.toLowerCase()) ||
                        state.description.toLowerCase().includes(term.toLowerCase());

                    return matchesSearch;
                });
                set({ searchTerm: term, filteredStates: filtered });
            },

            clearFilters: () => {
                const { states } = get();
                set({
                    searchTerm: '',
                    filteredStates: states
                });
            },

            getStates: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const response = await StateService.getInstance().getStates(page, limit);

                    if (response && response.records) {
                        const { searchTerm } = get();
                        const allStates = response.records;

                        const filtered = allStates.filter((state) => {
                            const matchesSearch = searchTerm === '' ||
                                state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                state.description.toLowerCase().includes(searchTerm.toLowerCase());

                            return matchesSearch;
                        });

                        set({
                            states: allStates,
                            filteredStates: filtered,
                            currentPage: response.page,
                            totalPages: response.pages,
                            loading: false,
                            error: null
                        });
                        return response;
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (error) {
                    console.error('Error in getStates:', error);
                    set({
                        error: 'Error al cargar los estados',
                        loading: false,
                        states: [],
                        filteredStates: []
                    });
                    throw error;
                }
            },

            getStateById: async (stateId: number) => {
                try {
                    return await StateService.getInstance().getStateById(stateId);
                } catch {
                    set({ error: 'Error al cargar el estado' });
                    return undefined;
                }
            },

            addState: async (state: Partial<IState>) => {
                try {
                    set({ loading: true, error: null });
                    await StateService.getInstance().createState(state);
                    await get().getStates(1, 10); // Reset to first page after adding
                    set({ loading: false });
                } catch (error) {
                    console.error('Error adding state:', error);
                    set({
                        error: 'Error al crear el estado',
                        loading: false
                    });
                    throw error;
                }
            },

            updateState: async (id: number, state: Partial<IState>) => {
                try {
                    set({ loading: true, error: null });
                    await StateService.getInstance().updateState(id, state);
                    await get().getStates(get().currentPage, 10); // Stay on current page after update
                    set({ loading: false });
                } catch (error) {
                    console.error('Error updating state:', error);
                    set({
                        error: 'Error al actualizar el estado',
                        loading: false
                    });
                    throw error;
                }
            },

            deleteState: async (stateId: number) => {
                try {
                    set({ loading: true, error: null });
                    await StateService.getInstance().deleteState(stateId);
                    const { currentPage, states } = get();
                    if (states.length === 1 && currentPage > 1) {
                        // Si es el último item de la página actual y no es la primera página
                        await get().getStates(currentPage - 1, 10);
                    } else {
                        // Refrescamos la página actual
                        await get().getStates(currentPage, 10);
                    }
                    set({ loading: false });
                } catch (error) {
                    console.error('Error deleting state:', error);
                    set({
                        error: 'Error al eliminar el estado',
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
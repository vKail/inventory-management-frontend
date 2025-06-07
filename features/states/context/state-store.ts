import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IState, PaginatedResponse } from '../data/interfaces/state.interface';
import { StateService } from '../services/state.service';

interface StateStore {
    states: IState[];
    loading: boolean;
    error: string | null;
    getStates: (page?: number, limit?: number) => Promise<PaginatedResponse<IState>>;
    getStateById: (stateId: number) => Promise<IState | undefined>;
    addState: (state: Partial<IState>) => Promise<void>;
    updateState: (stateId: number, state: Partial<IState>) => Promise<void>;
    deleteState: (stateId: number) => Promise<void>;
}

const STORE_NAME = 'state-storage';

export const useStateStore = create<StateStore>()(
    persist(
        (set, get) => ({
            states: [],
            loading: false,
            error: null,

            getStates: async (page = 1, limit = 10) => {
                set({ loading: true });
                try {
                    const response = await StateService.getInstance().getStates(page, limit);

                    console.log("response 1", response);
                    if (response && response.records) {
                        set({
                            states: response.records,
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
                        states: []
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
                    await get().getStates();
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
                    await get().getStates();
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
                    const newStates = get().states.filter(s => s.id !== stateId);
                    set({ states: newStates, loading: false });
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
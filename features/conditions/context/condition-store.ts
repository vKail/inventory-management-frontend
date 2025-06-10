import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICondition } from '../data/interfaces/condition.interface';
import { ConditionService } from '../services/condition.service';

interface ConditionStore {
    conditions: ICondition[];
    filteredConditions: ICondition[];
    searchTerm: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getConditions: (page?: number, limit?: number) => Promise<void>;
    getConditionById: (conditionId: string) => Promise<ICondition | undefined>;
    addCondition: (condition: Partial<ICondition>) => Promise<void>;
    updateCondition: (conditionId: string, condition: Partial<ICondition>) => Promise<void>;
    deleteCondition: (conditionId: string) => Promise<void>;
    refreshTable: () => Promise<void>;
    setSearchTerm: (term: string) => void;
}

const STORE_NAME = 'condition-storage';

export const useConditionStore = create<ConditionStore>()(
    persist(
        (set, get) => ({
            conditions: [],
            filteredConditions: [],
            searchTerm: '',
            loading: false,
            error: null,
            currentPage: 1,
            totalPages: 1,

            setSearchTerm: (term: string) => {
                const conditions = get().conditions;
                const filtered = conditions.filter((c) =>
                    c.name.toLowerCase().startsWith(term.toLowerCase()) ||
                    c.description.toLowerCase().startsWith(term.toLowerCase())
                );
                set({ searchTerm: term, filteredConditions: filtered });
            },

            refreshTable: async () => {
                const { currentPage } = get();
                await get().getConditions(currentPage, 10);
            },

            getConditions: async (page = 1, limit = 10) => {
                try {
                    set({ loading: true, error: null });
                    const response = await ConditionService.getInstance().getConditions(page, limit);

                    if (response.pages > 0 && page > response.pages) {
                        await get().getConditions(1, limit);
                        return;
                    }

                    const searchTerm = get().searchTerm;
                    const allConditions = response.records;

                    const filtered = searchTerm
                        ? allConditions.filter((c) =>
                            c.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                            c.description.toLowerCase().startsWith(searchTerm.toLowerCase())
                        )
                        : allConditions;

                    set({
                        conditions: allConditions,
                        filteredConditions: filtered,
                        currentPage: response.page,
                        totalPages: response.pages,
                        loading: false,
                        error: null
                    });
                } catch (error) {
                    console.error('Error fetching conditions:', error);
                    set({
                        error: 'Error al cargar las condiciones',
                        loading: false,
                        conditions: [],
                        filteredConditions: [],
                        currentPage: 1,
                        totalPages: 1
                    });
                }
            },

            getConditionById: async (conditionId: string) => {
                try {
                    return await ConditionService.getInstance().getConditionById(conditionId);
                } catch {
                    set({ error: 'Error al cargar la condición' });
                    return undefined;
                }
            },

            addCondition: async (condition: Partial<ICondition>) => {
                try {
                    set({ loading: true, error: null });
                    await ConditionService.getInstance().createCondition(condition);
                    await get().getConditions(1, 10);
                } catch (error) {
                    console.error('Error adding condition:', error);
                    set({
                        error: 'Error al crear la condición',
                        loading: false
                    });
                    throw error;
                }
            },

            updateCondition: async (id: string, condition: Partial<ICondition>) => {
                try {
                    set({ loading: true, error: null });
                    await ConditionService.getInstance().updateCondition(id, condition);
                    await get().refreshTable();
                } catch (error) {
                    console.error('Error updating condition:', error);
                    set({
                        error: 'Error al actualizar la condición',
                        loading: false
                    });
                    throw error;
                }
            },

            deleteCondition: async (conditionId: string) => {
                try {
                    set({ loading: true, error: null });
                    await ConditionService.getInstance().deleteCondition(conditionId);

                    const { currentPage, conditions } = get();
                    if (conditions.length === 1 && currentPage > 1) {
                        await get().getConditions(currentPage - 1, 10);
                    } else {
                        await get().refreshTable();
                    }
                } catch (error) {
                    console.error('Error deleting condition:', error);
                    set({
                        error: 'Error al eliminar la condición',
                        loading: false
                    });
                    throw error;
                }
            }
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

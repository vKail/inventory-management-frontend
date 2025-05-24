import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ICondition } from '../data/interfaces/condition.interface';
import { ConditionService } from '../services/condition.service';

interface ConditionStore {
    conditions: ICondition[];
    loading: boolean;
    error: string | null;
    getConditions: (page?: number, limit?: number) => Promise<void>;
    getConditionById: (conditionId: string) => Promise<ICondition | undefined>;
    addCondition: (condition: Partial<ICondition>) => Promise<void>;
    updateCondition: (conditionId: string, condition: Partial<ICondition>) => Promise<void>;
    deleteCondition: (conditionId: string) => Promise<void>;
}

const STORE_NAME = 'condition-storage';

export const useConditionStore = create<ConditionStore>()(
    persist(
        (set, get) => ({
            conditions: [],
            loading: false,
            error: null,

            getConditions: async (page = 1, limit = 10) => {
                try {
                    set({ loading: true, error: null });
                    const { records } = await ConditionService.getInstance().getConditions(page, limit);

                    console.log(records)
                    set({
                        conditions: records,
                        loading: false,
                    });
                } catch (error) {
                    console.error('Error fetching conditions:', error);
                    set({
                        error: 'Error al cargar las condiciones',
                        loading: false,
                        conditions: [],
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
                    await get().getConditions();
                    set({ loading: false });
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
                    await get().getConditions();
                    set({ loading: false });
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
                    const newConditions = get().conditions.filter(c => c.id !== conditionId);
                    set({ conditions: newConditions, loading: false });
                } catch (error) {
                    console.error('Error deleting condition:', error);
                    set({
                        error: 'Error al eliminar la condición',
                        loading: false
                    });
                    throw error;
                }
            },
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
        }
    )
); 
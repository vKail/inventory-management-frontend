import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Loan, LoanCreate, LoanReturn } from "../data/interfaces/loan.interface";
import { loanService } from "../services/loan.service";

export interface LoanFilters {
    search?: string;
    status?: string;
    view?: 'table' | 'grid' | 'list';
}

interface LoanState {
    loans: Loan[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    selectedLoan: Loan | null;
    filters: LoanFilters;
    getLoans: (page?: number, limit?: number) => Promise<void>;
    getLoanById: (id: number) => Promise<void>;
    getLoanHistoryByDni: (dni: string) => Promise<Loan[]>;
    createLoan: (loan: LoanCreate) => Promise<void>;
    returnLoan: (loanId: number, loanReturn: LoanReturn) => Promise<void>;
    setSelectedLoan: (loan: Loan | null) => void;
    setPage: (page: number) => void;
    setFilters: (filters: Partial<LoanFilters>) => void;
    refreshTable: () => Promise<void>;
}

const STORE_NAME = 'loan-storage';

export const useLoanStore = create<LoanState>()(
    persist(
        (set, get) => ({
            loans: [],
            loading: false,
            error: null,
            totalPages: 0,
            currentPage: 1,
            selectedLoan: null,
            filters: {
                status: 'DELIVERED'
            },

            setPage: (page: number) => {
                set({ currentPage: page });
                get().refreshTable();
            },

            setFilters: (newFilters) => {
                set((state) => ({
                    filters: { ...state.filters, ...newFilters },
                    currentPage: 1
                }));
                get().refreshTable();
            },

            refreshTable: async () => {
                const { currentPage, filters } = get();
                await get().getLoans(currentPage, 10);
            },

            getLoans: async (page = 1, limit = 10) => {
                try {
                    set({ loading: true, error: null });
                    const { filters } = get();

                    // Construir query params
                    const queryParams = new URLSearchParams();
                    if (filters.search) queryParams.append('search', filters.search);
                    if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
                    queryParams.append('page', page.toString());
                    queryParams.append('limit', limit.toString());

                    const response = await loanService.getAll(queryParams.toString());

                    if (response.success) {
                        const { records, pages, page: currentPage } = response.data;
                        set({
                            loans: records,
                            totalPages: pages,
                            currentPage,
                            loading: false
                        });
                    } else {
                        set({ error: response.message.content[0], loading: false });
                    }
                } catch (error) {
                    console.error('Error fetching loans:', error);
                    set({ error: "Error al cargar los préstamos", loading: false });
                }
            },

            getLoanById: async (id: number) => {
                try {
                    set({ loading: true, error: null });
                    const loan = await loanService.getById(id);
                    if (loan) {
                        set({ selectedLoan: loan, loading: false });
                    } else {
                        set({ error: "Préstamo no encontrado", loading: false });
                    }
                } catch (error) {
                    set({ error: "Error al cargar el préstamo", loading: false });
                }
            },

            getLoanHistoryByDni: async (dni: string) => {
                try {
                    set({ loading: true, error: null });
                    const history = await loanService.getHistoryByDni(dni);
                    set({ loading: false });
                    return history;
                } catch (error) {
                    set({ loading: false, error: 'Error al cargar el historial' });
                    console.error('Error fetching loan history:', error);
                    return [];
                }
            },

            createLoan: async (loan: LoanCreate) => {
                try {
                    set({ loading: true, error: null });
                    const response = await loanService.create(loan);
                    if (response.success) {
                        set({ loading: false });
                    } else {
                        set({ error: response.message.content[0], loading: false });
                    }
                } catch (error) {
                    set({ error: "Error al crear el préstamo", loading: false });
                }
            },

            returnLoan: async (loanId: number, loanReturn: LoanReturn) => {
                try {
                    set({ loading: true, error: null });
                    const response = await loanService.return(loanReturn);
                    if (!response.success) {
                        throw new Error(response.message.content.join(", "));
                    }
                    await get().refreshTable();
                    set({ loading: false });
                } catch (error) {
                    console.error("Error returning loan:", error);
                    set({
                        error: "Error al devolver el préstamo",
                        loading: false,
                    });
                    throw error;
                }
            },

            setSelectedLoan: (loan: Loan | null) => {
                set({ selectedLoan: loan });
            },
        }),
        {
            name: STORE_NAME,
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                currentPage: state.currentPage,
                filters: state.filters,
            }),
        }
    )
);

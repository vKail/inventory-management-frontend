import { create } from 'zustand';
import { AxiosClient } from '../../../core/infrestucture/AxiosClient';
import { LoanService } from '../services/loan.service';
import { Loan, LoanStatus, LoanListResponse } from '../data/schemas/loan.schema';

interface LoanState {
  loans: Loan[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isLoading: {
    fetch: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
  getLoans: (page: number, limit: number) => Promise<void>;
  getLoanById: (id: number) => Promise<Loan | null>;
  markAsReturned: (id: number) => void;
}

const client = AxiosClient.getInstance();
const loanService = new LoanService(client);

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: [],
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 10,
  isLoading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
  getLoans: async (page: number, limit: number) => {
    set((state) => ({
      ...state,
      isLoading: { ...state.isLoading, fetch: true },
      error: null,
    }));
    try {
      const response = await loanService.getLoans(page, limit) as LoanListResponse;
      if (response && response.records) {
        set((state) => ({
          loans: response.records,
          currentPage: response.page,
          totalPages: response.pages,
          totalItems: response.total,
          itemsPerPage: response.limit,
          isLoading: { ...state.isLoading, fetch: false },
          error: null,
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: { ...state.isLoading, fetch: false },
        error: 'Error al cargar los préstamos',
      }));
      throw error;
    }
  },
  getLoanById: async (id: number) => {
    set((state) => ({
      ...state,
      isLoading: { ...state.isLoading, fetch: true },
      error: null,
    }));
    try {
      const response = await loanService.getLoanById(id);
      set((state) => ({
        ...state,
        isLoading: { ...state.isLoading, fetch: false },
      }));
      return response as Loan;
    } catch (error) {
      set((state) => ({
        ...state,
        isLoading: { ...state.isLoading, fetch: false },
        error: 'Error al cargar el préstamo',
      }));
      return null;
    }
  },
  markAsReturned: (id: number) => {
    set((state) => ({
      ...state,
      loans: state.loans.map((loan) =>
        loan.id === id
          ? { ...loan, status: loan.actualReturnDate ? LoanStatus.RETURNED : LoanStatus.RETURNED_LATE }
          : loan
      ),
    }));
  },
}));
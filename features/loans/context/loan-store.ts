import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoanStatus } from '../data/schemas/loan.schema';

interface LoanDetail {
    id: number;
    loanId: number;
    itemId: number;
    exitConditionId: number;
    returnConditionId: number | null;
    item?: {
        id: number;
        name: string;
        code: string;
    };
}

interface Loan {
    id: number;
    requestorId: number;
    approverId: number | null;
    reason: string;
    associatedEvent?: string;
    externalLocation: string;
    notes?: string;
    status: LoanStatus;
    deliveryDate: string | null;
    scheduledReturnDate: string;
    actualReturnDate: string | null;
    reminderSent: boolean;
    loanDetails: LoanDetail[];
}

interface LoanState {
    loans: Loan[];
    isLoading: {
        fetch: boolean;
        create: boolean;
        update: boolean;
    };
    error: string | null;
    getLoans: (page?: number, limit?: number) => Promise<void>;
    getLoanById: (id: number) => Promise<Loan | undefined>;
    createLoan: (data: any) => Promise<void>;
    updateLoan: (id: number, data: any) => Promise<void>;
    copyLoan: (id: number) => Promise<any>;
}

interface ApiResponse<T> {
    success: boolean;
    message: {
        content: string[];
        displayable: boolean;
    };
    data: {
        records: T[];
        total: number;
        limit: number;
        page: number;
        pages: number;
    };
}

const STORE_NAME = 'loan-storage';

export const useLoanStore = create<LoanState>()(
    persist(
        (set, get) => ({
            loans: [],
            isLoading: {
                fetch: false,
                create: false,
                update: false,
            },
            error: null,

            getLoans: async (page = 1, limit = 10) => {
                set(state => ({ isLoading: { ...state.isLoading, fetch: true } }));
                try {
                    // Aquí deberías hacer la llamada real a tu API
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans?page=${page}&limit=${limit}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    const data: ApiResponse<Loan> = await response.json();

                    if (!data.success) {
                        throw new Error(data.message.content[0]);
                    }

                    set({
                        loans: data.data.records,
                        isLoading: { fetch: false, create: false, update: false },
                        error: null
                    });
                } catch (error) {
                    console.error('Error fetching loans:', error);
                    set(state => ({
                        error: 'Error al cargar los préstamos',
                        isLoading: { ...state.isLoading, fetch: false }
                    }));
                }
            },

            getLoanById: async (id: number) => {
                try {
                    const loan = get().loans.find(l => l.id === id);
                    return loan;
                } catch (error) {
                    console.error('Error fetching loan:', error);
                    set({ error: 'Error al cargar el préstamo' });
                    return undefined;
                }
            },

            createLoan: async (data: any) => {
                set(state => ({ isLoading: { ...state.isLoading, create: true } }));
                try {
                    // Aquí deberías hacer la llamada real a tu API
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify(data),
                    });

                    const responseData = await response.json();

                    if (!responseData.success) {
                        throw new Error(responseData.message.content[0]);
                    }

                    await get().getLoans(); // Recargar la lista después de crear
                } catch (error) {
                    console.error('Error creating loan:', error);
                    set(state => ({
                        error: 'Error al crear el préstamo',
                        isLoading: { ...state.isLoading, create: false }
                    }));
                    throw error;
                }
            },

            updateLoan: async (id: number, data: any) => {
                set(state => ({ isLoading: { ...state.isLoading, update: true } }));
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify(data),
                    });

                    const responseData = await response.json();

                    if (!responseData.success) {
                        throw new Error(responseData.message.content[0]);
                    }

                    await get().getLoans(); // Recargar la lista después de actualizar
                } catch (error) {
                    console.error('Error updating loan:', error);
                    set(state => ({
                        error: 'Error al actualizar el préstamo',
                        isLoading: { ...state.isLoading, update: false }
                    }));
                    throw error;
                }
            },

            copyLoan: async (id: number) => {
                const loan = await get().getLoanById(id);
                if (!loan) {
                    throw new Error('Préstamo no encontrado');
                }

                return {
                    motivo: loan.reason,
                    eventoAsociado: loan.associatedEvent || '',
                    ubicacionExterna: loan.externalLocation,
                    notas: loan.notes || '',
                    items: loan.loanDetails.map(detail => ({
                        id: detail.itemId,
                        name: detail.item?.name || '',
                        barcode: detail.item?.code || '',
                        description: ''
                    }))
                };
            }
        }),
        {
            name: STORE_NAME,
        }
    )
); 
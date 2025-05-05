// features/loans/context/loans-store.ts

import { create } from 'zustand';
import { Loan, LoanStatus } from '../data/interfaces/loan.interface';

interface LoanState {
  loans: Loan[];
  filteredLoans: Loan[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filterLoans: (tab: string, search?: string) => void;
  markAsReturned: (id: string) => void;
}

export const useLoanStore = create<LoanState>((set, get) => {
  const sampleLoans: Loan[] = [
    {
      id: "1",
      productId: "1",
      userId: "u1",
      startDate: new Date("2023-04-01"),
      dueDate: new Date("2023-04-08"),
      status: "active",
      product: {
        id: "1",
        barcode: "TEC-001",
        name: "MacBook Pro 16''",
        category: "technology",
        department: "computing",
        quantity: 1,
        status: "available",
        description: "",
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u1",
        name: "Carlos Méndez",
        email: "test@test.com",
        role: "student",
        studentId: "A12345",
      },
    },
  ];

  return {
    loans: sampleLoans,
    filteredLoans: sampleLoans,
    activeTab: 'all',

    setActiveTab: (tab) => {
      const { loans } = get();
      const filtered = tab === 'all' ? loans : loans.filter((l) => l.status === tab);
      set({ activeTab: tab, filteredLoans: filtered });
    },

    filterLoans: (tab, search = '') => {
      const { loans } = get();
      let filtered = loans;

      if (tab !== 'all') {
        filtered = filtered.filter((l) => l.status === tab);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter((l) =>
          l.product?.name.toLowerCase().includes(q) ||
          l.product?.barcode.toLowerCase().includes(q) ||
          l.user?.name.toLowerCase().includes(q) ||
          l.user?.studentId?.toLowerCase().includes(q)
        );
      }

      set({ filteredLoans: filtered });
    },

    markAsReturned: (id: string) => {
      const { loans, activeTab } = get();

      const updated = loans.map((loan) =>
        loan.id === id
          ? {
              ...loan,
              status: 'returned' as LoanStatus,
              returnDate: new Date(),
            }
          : loan
      );

      const filtered =
        activeTab === 'all'
          ? updated
          : updated.filter((l) => l.status === activeTab);

      set({ loans: updated, filteredLoans: filtered });
    },
  };
});

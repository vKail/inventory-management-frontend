import { create } from 'zustand';
import { Loan } from '../data/interfaces/loan.interface';

interface LoanState {
  loans: Loan[];
  filteredLoans: Loan[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useLoanStore = create<LoanState>((set) => {
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
    setActiveTab: (tab) =>
      set((state) => {
        const filtered =
          tab === "all"
            ? state.loans
            : state.loans.filter((loan) => loan.status === tab);
        return { activeTab: tab, filteredLoans: filtered };
      }),
  };
});

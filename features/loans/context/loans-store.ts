import { create } from 'zustand';
import { Loan } from '../data/interfaces/loan.interface';
import { LoanStatus } from '../data/enums/loan-status.enum';

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
      startDate: new Date("2024-05-01"),
      dueDate: new Date("2024-05-10"),
      status: LoanStatus.ACTIVE,
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
        email: "carlos@test.com",
        role: "student",
        studentId: "A12345",
      },
    },
    {
      id: "2",
      productId: "2",
      userId: "u2",
      startDate: new Date("2024-05-02"),
      dueDate: new Date("2024-05-12"),
      status: LoanStatus.ACTIVE,
      product: {
        id: "2",
        barcode: "TEC-002",
        name: "Tablet Samsung Galaxy Tab",
        category: "technology",
        department: "electronics",
        quantity: 1,
        status: "available",
        description: "",
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u2",
        name: "Ana López",
        email: "ana@test.com",
        role: "teacher",
      },
    },

    {
      id: "3",
      productId: "3",
      userId: "u3",
      startDate: new Date("2024-04-01"),
      dueDate: new Date("2024-04-08"),
      returnDate: new Date("2024-04-07"),
      status: LoanStatus.RETURNED,
      product: {
        id: "3",
        barcode: "TEC-003",
        name: "Cámara Canon EOS",
        category: "multimedia",
        department: "design",
        quantity: 1,
        status: "available",
        description: "",
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u3",
        name: "Luis Pérez",
        email: "luis@test.com",
        role: "student",
        studentId: "C20234",
      },
    },
    {
      id: "4",
      productId: "4",
      userId: "u4",
      startDate: new Date("2024-04-10"),
      dueDate: new Date("2024-04-15"),
      returnDate: new Date("2024-04-15"),
      status: LoanStatus.RETURNED,
      product: {
        id: "4",
        barcode: "TEC-004",
        name: "Teclado Mecánico Logitech",
        category: "accessories",
        department: "computing",
        quantity: 1,
        status: "available",
        description: "",
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u4",
        name: "Valeria Díaz",
        email: "valeria@test.com",
        role: "admin",
      },
    },

    {
      id: "5",
      productId: "5",
      userId: "u5",
      startDate: new Date("2024-03-01"),
      dueDate: new Date("2024-03-05"),
      status: LoanStatus.OVERDUE,
      product: {
        id: "5",
        barcode: "TEC-005",
        name: "Proyector Epson",
        category: "multimedia",
        department: "audiovisual",
        quantity: 1,
        status: "borrowed",
        description: "",
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u5",
        name: "Marco León",
        email: "marco@test.com",
        role: "student",
        studentId: "D99876",
      },
    },
    {
      id: "6",
      productId: "6",
      userId: "u6",
      startDate: new Date("2024-02-20"),
      dueDate: new Date("2024-03-01"),
      status: LoanStatus.OVERDUE,
      product: {
        id: "6",
        barcode: "TEC-006",
        name: "Kit Arduino Starter",
        category: "technology",
        department: "electronics",
        quantity: 1,
        status: "borrowed",
        description: "",
        cost: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      user: {
        id: "u6",
        name: "Sofía Ramírez",
        email: "sofia@test.com",
        role: "student",
        studentId: "E11009",
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
              status: LoanStatus.RETURNED,
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

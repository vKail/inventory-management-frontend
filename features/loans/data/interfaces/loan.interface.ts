// features/loans/data/interfaces/loan.interface.ts

export type LoanStatus = 'active' | 'returned' | 'overdue';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  status: string;
  description: string;
  cost: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  studentId?: string;
  department?: string;
}

export interface Loan {
  id: string;
  productId: string;
  userId: string;
  startDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: LoanStatus;
  notes?: string;
  product?: Product;
  user?: User;
}

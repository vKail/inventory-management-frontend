
import { UserRole } from "@/features/users/data/enums/user-roles.enums";
import { Department } from "@/features/departments/data/enums/department.enum";
import { Product } from "@/features/product/data/enum/product.enum";

export interface Loan {

    id: string;
    productId: string;
    product?: Product;
    userId: string;
    user?: User;
    startDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: "active" | "returned" | "overdue";
    notes?: string;
  }
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: Department;
    studentId?: string;
  }
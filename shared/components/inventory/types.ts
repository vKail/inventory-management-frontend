// types.ts

// Tipos de usuario
export enum UserRole {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
  }
  
  // Categorías de productos
  export enum ProductCategory {
    TECHNOLOGY = "technology",
    FURNITURE = "furniture",
    ELECTRONICS = "electronics",
    TOOLS = "tools",
    MATERIALS = "materials",
    OTHER = "other",
  }
  
  // Departamentos
  export enum Department {
    COMPUTING = "computing",
    ELECTRONICS = "electronics",
    DESIGN = "design",
    MECHANICS = "mechanics",
    GENERAL = "general",
  }
  
  // Estado del producto
  export enum ProductStatus {
    AVAILABLE = "available",
    IN_USE = "in_use",
    MAINTENANCE = "maintenance",
    DAMAGED = "damaged",
  }
  
  // Usuario
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department?: Department;
    studentId?: string;
  }
  
  // Producto
  export interface Product {
    id: string;
    barcode: string;
    name: string;
    category: ProductCategory;
    department: Department;
    quantity: number;
    status: ProductStatus;
    description: string;
    imageUrl?: string;
    cost: number;
    createdAt: Date | string;  // Ajusta si recibes string desde backend
    updatedAt: Date | string;
  }
  
  // Préstamo
  export interface Loan {
    id: string;
    productId: string;
    product?: Product;
    userId: string;
    user?: User;
    startDate: Date | string;
    dueDate: Date | string;
    returnDate?: Date | string;
    status: "active" | "returned" | "overdue";
    notes?: string;
  }
  
  // Notificación
  export interface Notification {
    id: string;
    userId: string;
    loanId?: string;
    message: string;
    read: boolean;
    type: "reminder" | "overdue" | "system";
    createdAt: Date | string;
  }
  
  // Props para componente de producto
  export interface ProductCardProps {
    product: Product;
    onLoanClick?: (product: Product) => void;
    onViewClick?: (product: Product) => void;
  }
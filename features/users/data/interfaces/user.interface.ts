import { UserRole, UserStatus, UserFormValues } from '../schemas/user.schema';

export type { UserFormValues };
export { UserRole, UserStatus };

export interface Person {
  dni: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  secondLastName?: string;
  email: string;
  birthDate?: string;
  phone?: string;
}

export interface User {
  id: number;
  userName: string;
  password?: string;
  career: string | null;
  userType: string;
  status: string;
  person: Person;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

// UserFormValues is now imported from the schema file

export interface PaginatedResponse {
  limit: number;
  page: number;
  pages: number;
  records: User[];
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

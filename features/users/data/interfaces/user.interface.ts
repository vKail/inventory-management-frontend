export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  ADMINISTRATOR = 'ADMINISTRATOR'
}

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

export interface UserFormValues {
  name: string;
  email: string;
  role: string;
  password: string;
  person: {
    dni: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    email: string;
    birthDate?: string;
    phone?: string;
  };
  career: string | null;
  userType: string;
  userName: string;
  status?: string;
}

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

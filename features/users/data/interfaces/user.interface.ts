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
  password: string;
  career: string;
  userType: string;
  status: string;
  person: Person;
}

export interface PaginatedUsers {
  total: number;
  limit: number;
  page: number;
  pages: number;
  records: User[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  pages: number;
  currentPage: number;
}

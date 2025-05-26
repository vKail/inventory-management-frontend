export interface Person {
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IUser {
  id: number;
  userName: string;
  password?: string;
  career: string;
  userType: string;
  status: string;
  person: Person;
  active: boolean;
  role: string;
}

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
  pages: number;
  currentPage: number;
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

export interface IState {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface CreateStateDTO {
  name: string;
  description: string;
  active?: boolean;
}

export interface UpdateStateDTO extends Partial<CreateStateDTO> { }

export interface PaginatedResponse<T> {
  success: boolean;
  message: {
    content: string[];
  };
  records: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
  };
  records: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

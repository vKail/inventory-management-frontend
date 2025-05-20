

///borrar arriba

 export interface Warehouse {
  id: string;
  name: string;
  location: string;
  responsibleId: number;
  description: string;
  active: boolean;
}

export interface Responsible {
  id: number;
  name: string;
}

export interface PaginatedWarehouses {
  total: number;
  limit: number;
  page: number;
  pages: number;
  records: Warehouse[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

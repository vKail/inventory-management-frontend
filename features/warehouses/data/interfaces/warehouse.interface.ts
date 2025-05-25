///borrar arriba

export interface IWarehouse {
  name: string;
  address: string;
  phone: string;
  capacity: number;
  description?: string;
  active?: boolean;
}

export interface IWarehouseResponse extends IWarehouse {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedWarehouses {
  records: IWarehouseResponse[];
  page: number;
  pages: number;
  limit: number;
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

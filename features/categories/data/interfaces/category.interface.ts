export interface ICategory {
  id: number;
  code: string;
  name: string;
  description: string;
  parentCategoryId: number | null;
  parentCategory?: ICategory | null;
  standardUsefulLife: number;
  depreciationPercentage: string;
  active: boolean;
}

export interface PaginatedResponse<T> {
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
  data: T;
}

export type PaginatedCategories = PaginatedResponse<ICategory>;

export interface CreateCategoryDTO extends Omit<ICategory, 'id' | 'parentCategory'> { }
export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> { }
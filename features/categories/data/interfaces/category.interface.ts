export interface ApiResponse<T> {
  success: boolean;
  message: {
    content: string[];
    displayable: boolean;
  };
  data: T;
}

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

export interface PaginatedCategories {
  records: ICategory[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}
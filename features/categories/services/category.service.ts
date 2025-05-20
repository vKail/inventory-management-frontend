// services/category.service.ts
import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ApiResponse, ICategory, PaginatedCategories } from '../data/interfaces/category.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface CategoryServiceProps {
  getCategories: (page?: number, limit?: number, search?: string) => Promise<PaginatedCategories>;
  getCategoryById: (id: number) => Promise<ICategory | undefined>;
  createCategory: (category: ICategory) => Promise<ICategory | undefined>;
  updateCategory: (id: number, category: ICategory) => Promise<ICategory | undefined>;
  deleteCategory: (id: number) => Promise<void>;
}

export class CategoryService implements CategoryServiceProps {
  private static instance: CategoryService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}categories`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  public async getCategories(page = 1, limit = 10): Promise<PaginatedCategories> {
    try {
      const response = await this.httpClient.get<ApiResponse<PaginatedCategories>>(
        `${CategoryService.url}?page=${page}&limit=${limit}`
      );
      return response.data.data; // Extraemos los datos paginados
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        records: [],
        total: 0,
        limit,
        page,
        pages: 0,
      };
    }
  }

  public async getCategoryById(id: number): Promise<ICategory | undefined> {
    try {
      const response = await this.httpClient.get<ApiResponse<ICategory>>(
        `${CategoryService.url}/${id}`
      );
      return response.data.data; // Extraemos los datos del objeto data
    } catch (error) {
      console.error('Error fetching category:', error);
      return undefined;
    }
  }

  public async createCategory(category: ICategory): Promise<ICategory | undefined> {
    try {
      // Exclude 'active' property from the category object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { active, ...categoryWithoutActive } = category;
      const { data } = await this.httpClient.post<{ data: ICategory }>(
        CategoryService.url,
        categoryWithoutActive
      );
      return data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  public async updateCategory(id: number, category: ICategory): Promise<ICategory | undefined> {
    try {
      const { data } = await this.httpClient.patch<{ data: ICategory }>(
        `${CategoryService.url}/${id}`,
        category
      );
      return data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  public async deleteCategory(id: number): Promise<void> {
    try {
      await this.httpClient.delete(`${CategoryService.url}/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

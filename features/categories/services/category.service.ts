// services/category.service.ts
import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { ICategory, PaginatedCategories, ApiResponse, CreateCategoryDTO, UpdateCategoryDTO } from '../data/interfaces/category.interface';

interface CategoryServiceProps {
  getCategories: (page?: number, limit?: number) => Promise<PaginatedCategories>;
  getCategoryById: (id: number) => Promise<ICategory | undefined>;
  createCategory: (category: CreateCategoryDTO) => Promise<ICategory | undefined>;
  updateCategory: (id: number, category: UpdateCategoryDTO) => Promise<ICategory | undefined>;
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
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  public async getCategoryById(id: number): Promise<ICategory | undefined> {
    try {
      const response = await this.httpClient.get<ApiResponse<ICategory>>(`${CategoryService.url}/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching category:', error);
      return undefined;
    }
  }

  public async createCategory(category: CreateCategoryDTO): Promise<ICategory | undefined> {
    try {
      const response = await this.httpClient.post<ApiResponse<ICategory>>(CategoryService.url, category);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  public async updateCategory(id: number, category: UpdateCategoryDTO): Promise<ICategory | undefined> {
    try {
      const response = await this.httpClient.patch<ApiResponse<ICategory>>(`${CategoryService.url}/${id}`, category);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  public async deleteCategory(id: number): Promise<void> {
    try {
      const response = await this.httpClient.delete<ApiResponse<void>>(`${CategoryService.url}/${id}`);
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
}

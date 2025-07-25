import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ApiResponse, IMaterial, PaginatedMaterials } from '../data/interfaces/material.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface MaterialServiceProps {
  getMaterials: (page?: number, limit?: number, filters?: { name?: string; materialType?: string; allRecords?: boolean }) => Promise<PaginatedMaterials>;
  getMaterialById: (id: number) => Promise<IMaterial | undefined>;
  createMaterial: (material: Partial<IMaterial>) => Promise<IMaterial | undefined>;
  updateMaterial: (id: number, material: Partial<IMaterial>) => Promise<IMaterial | undefined>;
  deleteMaterial: (id: number) => Promise<void>;
}

export class MaterialService implements MaterialServiceProps {
  private static instance: MaterialService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}materials`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): MaterialService {
    if (!MaterialService.instance) {
      MaterialService.instance = new MaterialService();
    }
    return MaterialService.instance;
  }

  public async getMaterials(page = 1, limit = 10, filters?: { name?: string; materialType?: string; allRecords?: boolean }): Promise<PaginatedMaterials> {
    try {
      let url = `${MaterialService.url}?page=${page}&limit=${limit}`;

      // Add filter parameters if provided
      if (filters?.name && filters.name.trim() !== '') {
        url += `&name=${encodeURIComponent(filters.name.trim())}`;
      }

      if (filters?.materialType && filters.materialType !== 'all') {
        url += `&materialType=${encodeURIComponent(filters.materialType)}`;
      }

      // Add allRecords parameter if provided
      if (filters?.allRecords) {
        url += `&allRecords=true`;
        console.log('🔧 Materials API - allRecords=true added to URL');
      }

      console.log('🔧 Materials API URL:', url); // Debug log

      const response = await this.httpClient.get<PaginatedMaterials>(url);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  public async getMaterialById(id: number): Promise<IMaterial | undefined> {
    try {
      const response = await this.httpClient.get<IMaterial>(`${MaterialService.url}/${id}`);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching material:', error);
      return undefined;
    }
  }

  public async createMaterial(material: Partial<IMaterial>): Promise<IMaterial | undefined> {
    try {
      const response = await this.httpClient.post<IMaterial>(
        MaterialService.url,
        material
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    }
  }

  public async updateMaterial(id: number, material: Partial<IMaterial>): Promise<IMaterial | undefined> {
    try {
      const response = await this.httpClient.patch<IMaterial>(
        `${MaterialService.url}/${id}`,
        material
      );
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  }

  public async deleteMaterial(id: number): Promise<void> {
    try {
      const response = await this.httpClient.delete<ApiResponse<void>>(`${MaterialService.url}/${id}`);
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  }
}

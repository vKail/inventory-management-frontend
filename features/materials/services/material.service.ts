import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ApiResponse, IMaterial, PaginatedMaterials } from '../data/interfaces/material.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface MaterialServiceProps {
  getMaterials: (page?: number, limit?: number) => Promise<PaginatedMaterials>;
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

  public async getMaterials(page = 1, limit = 10): Promise<PaginatedMaterials> {
    try {
      const response = await this.httpClient.get<PaginatedMaterials>(
        `${MaterialService.url}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  }

  public async getMaterialById(id: number): Promise<IMaterial | undefined> {
    try {
      const response = await this.httpClient.get<IMaterial>(`${MaterialService.url}/${id}`);
      console.log(response.data)
      return response.data;
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
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    }
  }

  public async deleteMaterial(id: number): Promise<void> {
    try {
      const response = await this.httpClient.delete<ApiResponse<void>>(`${MaterialService.url}/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    }
  }
}

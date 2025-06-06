import { InventoryItem, FilterOption, LocationOption, PaginatedResponse } from "../data/interfaces/inventory.interface";
import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { HTTP_STATUS_CODE } from "@/core/data/HttpStatus";
import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { API_URL } from "@/config/constants";

const apiClient = AxiosClient.getInstance();

function getAuthHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
}

export class InventoryService {
  private static instance: InventoryService;
  private httpClient: HttpHandler;
  private static readonly url = `${API_URL}/items`;

  private constructor() {
    this.httpClient = AxiosClient.getInstance();
  }

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  public async getInventoryItems(page = 1, limit = 10): Promise<PaginatedResponse<InventoryItem>> {
    try {
      const response = await this.httpClient.get<PaginatedResponse<InventoryItem>>(
        `${InventoryService.url}?page=${page}&limit=${limit}`
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  public async getInventoryItemById(id: number): Promise<InventoryItem> {
    try {
      const response = await this.httpClient.get<InventoryItem>(
        `${InventoryService.url}/${id}`
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message.content.join(', ') || 'Producto no encontrado');
    } catch (error: any) {
      console.error('Error fetching inventory item:', error);
      throw new Error(error.message || 'Error al cargar el producto');
    }
  }

  public async createInventoryItem(item: Partial<InventoryItem>): Promise<InventoryItem> {
    try {
      const response = await this.httpClient.post<InventoryItem>(
        InventoryService.url,
        item
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error: any) {
      console.error('Error creating inventory item:', error);
      throw new Error(error.message || 'Error al crear el producto');
    }
  }

  public async updateInventoryItem(id: number, item: Partial<InventoryItem>): Promise<InventoryItem> {
    try {
      const response = await this.httpClient.patch<InventoryItem>(
        `${InventoryService.url}/${id}`,
        item
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message.content.join(', '));
    } catch (error: any) {
      console.error('Error updating inventory item:', error);
      if (error.response?.status === 404) {
        throw new Error('Producto no encontrado');
      }
      throw new Error(error.message || 'Error al actualizar el producto');
    }
  }

  public async deleteInventoryItem(id: number): Promise<void> {
    try {
      const response = await this.httpClient.delete<void>(
        `${InventoryService.url}/${id}`
      );
      if (!response.success) {
        throw new Error(response.message.content.join(', '));
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }

  public async uploadItemImage(id: number, imageFile: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("itemId", id.toString());

      const response = await this.httpClient.post<{ imageUrl: string }>(
        `${InventoryService.url}/item-images/upload`,
        formData
      );

      if (response.success && response.data && response.data.imageUrl) {
        return { imageUrl: response.data.imageUrl };
      }
      throw new Error(response.message.content.join(', ') || 'Error al subir la imagen');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.message || 'Error al subir la imagen');
    }
  }

  public async getInventoryItemByCode(code: string): Promise<InventoryItem | null> {
    try {
      const response = await this.httpClient.get<PaginatedResponse<InventoryItem>>(
        `${InventoryService.url}`,
        { params: { code, limit: 1 } }
      );

      if (response.success && response.data?.records?.length > 0) {
        return response.data.records[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching inventory item by code:', error);
      return null;
    }
  }

  // Filter services
  public async getCategories(): Promise<FilterOption[]> {
    try {
      const response = await this.httpClient.get<PaginatedResponse<any>>("/categories", {
        params: { limit: 1000, page: 1 },
        ...getAuthHeaders(),
      });

      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar las categorías");
      }

      return response.data.records.map((category: any) => ({
        id: category.id,
        name: category.name,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  public async getLocations(): Promise<LocationOption[]> {
    try {
      const response = await this.httpClient.get<PaginatedResponse<any>>("/locations", {
        params: { limit: 1000, page: 1 },
        ...getAuthHeaders()
      });

      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar las ubicaciones");
      }

      return response.data.records.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
        type: loc.type,
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  }

  public async getStates(): Promise<FilterOption[]> {
    try {
      const response = await this.httpClient.get<PaginatedResponse<any>>("/states", {
        params: { limit: 1000, page: 1 },
        ...getAuthHeaders(),
      });

      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar los estados");
      }

      return response.data.records.map((state: any) => ({
        id: state.id,
        name: state.name,
      }));
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  }

  public async getColors(): Promise<FilterOption[]> {
    try {
      const response = await this.httpClient.get<PaginatedResponse<any>>("/colors", {
        params: { limit: 1000, page: 1 },
        ...getAuthHeaders()
      });

      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar los colores");
      }

      return response.data.records.map((color: any) => ({
        id: color.id,
        name: color.name,
      }));
    } catch (error) {
      console.error("Error fetching colors:", error);
      return [];
    }
  }
}

export const inventoryService = InventoryService.getInstance();


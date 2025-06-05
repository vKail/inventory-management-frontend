import { InventoryItem, FilterOption, LocationOption } from "../data/interfaces/inventory.interface";
import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { HTTP_STATUS_CODE } from "@/core/data/HttpStatus";
import { InventoryListResponse, InventoryItemResponse } from "../data/schemas/inventory.schema";
import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { API_URL } from "@/config/constants";
import { ApiResponse, PaginatedResponse } from '@/shared/interfaces/api-response.interface';

const apiClient = AxiosClient.getInstance();

function getAuthHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
}

export const getInventoryItems = async (page: number = 1, limit: number = 20): Promise<IHttpResponse<any>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.get<IHttpResponse<any>>(`/items`, {
      ...getAuthHeaders(),
      params: { page, limit },
    });
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al cargar los ítems de inventario");
    }
    return response;
  } catch (error) {
    const axiosError = error as any;
    console.error("Error fetching inventory items:", axiosError.message);
    if (axiosError.response?.data?.message?.content) {
      throw new Error(axiosError.response.data.message.content[0]);
    }
    if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      throw new Error("No autorizado: Verifique el token de autenticación.");
    }
    throw new Error("Error al cargar los ítems de inventario");
  }
};

export const getInventoryItemById = async (id: number): Promise<IHttpResponse<any>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.get<IHttpResponse<any>>(`/items/${id}`, getAuthHeaders());
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al cargar el ítem por ID");
    }
    return response;
  } catch (error) {
    const axiosError = error as any;
    console.error("Error fetching inventory item by ID:", axiosError.message);
    if (axiosError.response?.data?.message?.content) {
      throw new Error(axiosError.response.data.message.content[0]);
    }
    if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      throw new Error("No autorizado: Verifique el token de autenticación.");
    }
    throw new Error("Error al cargar el ítem por ID");
  }
};

export const createInventoryItem = async (item: Partial<InventoryItem>): Promise<IHttpResponse<InventoryItem>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.post<IHttpResponse<InventoryItem>>("/items", item, getAuthHeaders());
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al crear el ítem de inventario");
    }
    return response.data;
  } catch (error) {
    const axiosError = error as any;
    console.error("Error creating inventory item:", axiosError.message);
    if (axiosError.response?.data?.message?.content) {
      throw new Error(axiosError.response.data.message.content[0]);
    }
    if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      throw new Error("No autorizado: Verifique el token de autenticación.");
    }
    throw new Error("Error al crear el ítem de inventario");
  }
};

export const updateInventoryItem = async (id: number, item: Partial<any>): Promise<IHttpResponse<any>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.patch<IHttpResponse<any>>(`/items/${id}`, item, getAuthHeaders());
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al actualizar el ítem de inventario");
    }
    return response;
  } catch (error) {
    const axiosError = error as any;
    console.error("Error updating inventory item:", axiosError.message);
    if (axiosError.response?.data?.message?.content) {
      throw new Error(axiosError.response.data.message.content[0]);
    }
    if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      throw new Error("No autorizado: Verifique el token de autenticación.");
    }
    throw new Error("Error al actualizar el ítem de inventario");
  }
};

export const deleteInventoryItem = async (id: number): Promise<IHttpResponse<void>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.delete<IHttpResponse<void>>(`/items/${id}`, getAuthHeaders());
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al eliminar el ítem de inventario");
    }
    return response.data;
  } catch (error) {
    const axiosError = error as any;
    console.error("Error deleting inventory item:", axiosError.message);
    if (axiosError.response?.data?.message?.content) {
      throw new Error(axiosError.response.data.message.content[0]);
    }
    if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
      throw new Error("No autorizado: Verifique el token de autenticación.");
    }
    throw new Error("Error al eliminar el ítem de inventario");
  }
};

export class InventoryFilterService {
  static async getCategories(): Promise<FilterOption[]> {
    if (!API_URL) {
      throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
    }

    try {
      const response = await apiClient.get<IHttpResponse<any>>("/categories", {
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
      const axiosError = error as any;
      console.error("Error fetching categories:", axiosError.message);
      if (axiosError.response?.data?.message?.content) {
        throw new Error(axiosError.response.data.message.content[0]);
      }
      if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        throw new Error("No autorizado: Verifique el token de autenticación.");
      }
      return [];
    }
  }

  static async getLocations(): Promise<LocationOption[]> {
    if (!API_URL) {
      throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
    }

    try {
      const response = await apiClient.get<IHttpResponse<{ records: any[] }>>("/locations", {
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
      const axiosError = error as any;
      console.error("Error fetching locations:", axiosError.message);
      if (axiosError.response?.data?.message?.content) {
        throw new Error(axiosError.response.data.message.content[0]);
      }
      if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        throw new Error("No autorizado: Verifique el token de autenticación.");
      }
      return [];
    }
  }


  static async getStates(): Promise<FilterOption[]> {
    if (!API_URL) {
      throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
    }

    try {
      const response = await apiClient.get<IHttpResponse<any>>("/states", {
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
      const axiosError = error as any;
      console.error("Error fetching states:", axiosError.message);
      if (axiosError.response?.data?.message?.content) {
        throw new Error(axiosError.response.data.message.content[0]);
      }
      if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        throw new Error("No autorizado: Verifique el token de autenticación.");
      }
      return [];
    }
  }

  static async getColors(): Promise<FilterOption[]> {
    if (!API_URL) {
      throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
    }

    try {
      const response = await apiClient.get<IHttpResponse<{ records: FilterOption[] }>>("/colors", {
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
      const axiosError = error as any;
      console.error("Error fetching colors:", axiosError.message);
      if (axiosError.response?.data?.message?.content) {
        throw new Error(axiosError.response.data.message.content[0]);
      }
      if (axiosError.response?.status === HTTP_STATUS_CODE.UNAUTHORIZED) {
        throw new Error("No autorizado: Verifique el token de autenticación.");
      }
      return [];
    }
  }


}

interface InventoryServiceProps {
  getInventoryItems: (page?: number, limit?: number) => Promise<PaginatedResponse<InventoryItem>>;
  getInventoryItemById: (id: number) => Promise<InventoryItem | undefined>;
  createInventoryItem: (item: Partial<InventoryItem>) => Promise<InventoryItem | undefined>;
  updateInventoryItem: (id: number, item: Partial<InventoryItem>) => Promise<InventoryItem | undefined>;
  deleteInventoryItem: (id: number) => Promise<void>;
  uploadItemImage: (id: number, imageFile: File) => Promise<{ imageUrl: string }>;
  getInventoryItemByCode: (code: string) => Promise<InventoryItem | null>;
}

export class InventoryService implements InventoryServiceProps {
  private static instance: InventoryService;
  private httpClient: HttpHandler;
  private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}items`;

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
      const response = await this.httpClient.get<ApiResponse<PaginatedResponse<InventoryItem>>>(
        `${InventoryService.url}?page=${page}&limit=${limit}`
      );
      if (response.success && response.data) {
        const { total, limit: responseLimit, page: responsePage, pages, records } = response.data;
        return {
          total,
          limit: responseLimit,
          page: responsePage,
          pages,
          records: records || []
        };
      }
      throw new Error(response.message.content.join(', '));
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  }

  public async getInventoryItemById(id: number): Promise<InventoryItem> {
    try {
      const response = await this.httpClient.get<ApiResponse<InventoryItem>>(
        `${InventoryService.url}/${id}`
      );
      console.log("response", response);
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
      const response = await this.httpClient.post<ApiResponse<InventoryItem>>(
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
      const response = await this.httpClient.patch<ApiResponse<InventoryItem>>(
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
      const response = await this.httpClient.delete<ApiResponse<void>>(
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

      const response = await this.httpClient.post<ApiResponse<{ imageUrl: string }>>(
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
      const response = await this.httpClient.get<ApiResponse<PaginatedResponse<InventoryItem>>>(
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
}

export const inventoryService = InventoryService.getInstance();


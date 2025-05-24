import { InventoryItem, FilterOption } from "../data/interfaces/inventory.interface";
import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { HTTP_STATUS_CODE } from "@/core/data/HttpStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = AxiosClient.getInstance();

export const getInventoryItems = async (page: number = 1, limit: number = 20): Promise<IHttpResponse<InventoryItem[]>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.get<IHttpResponse<InventoryItem[]>>(`/items`, {
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

export const getInventoryItemById = async (id: number): Promise<IHttpResponse<InventoryItem>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.get<IHttpResponse<InventoryItem>>(`/items/${id}`);
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
    const response = await apiClient.post<IHttpResponse<InventoryItem>>("/items", item);
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al crear el ítem de inventario");
    }
    return response;
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

export const updateInventoryItem = async (id: number, item: Partial<InventoryItem>): Promise<IHttpResponse<InventoryItem>> => {
  if (!API_URL) {
    throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
  }

  try {
    const response = await apiClient.patch<IHttpResponse<InventoryItem>>(`/items/${id}`, item);
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
    const response = await apiClient.delete<IHttpResponse<void>>(`/items/${id}`);
    if (!response.success) {
      throw new Error(response.message.content[0] || "Error al eliminar el ítem de inventario");
    }
    return response;
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
      const response = await apiClient.get<IHttpResponse<FilterOption[]>>("/categories");
      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar las categorías");
      }
      return response.data.map((category: any) => ({
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

  static async getLocations(): Promise<FilterOption[]> {
    if (!API_URL) {
      throw new Error("La variable de entorno NEXT_PUBLIC_API_URL no está definida.");
    }

    try {
      const response = await apiClient.get<IHttpResponse<FilterOption[]>>("/locations");
      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar las ubicaciones");
      }
      return response.data.map((location: any) => ({
        id: location.id,
        name: location.name,
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
      const response = await apiClient.get<IHttpResponse<FilterOption[]>>("/states");
      if (!response.success) {
        throw new Error(response.message.content[0] || "Error al cargar los estados");
      }
      return response.data.map((state: any) => ({
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
}
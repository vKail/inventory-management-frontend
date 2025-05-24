import { InventoryItem, FilterOption , LocationOption} from "../data/interfaces/inventory.interface";
import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { IHttpResponse } from "@/core/data/interfaces/HttpHandler";
import { HTTP_STATUS_CODE } from "@/core/data/HttpStatus";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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


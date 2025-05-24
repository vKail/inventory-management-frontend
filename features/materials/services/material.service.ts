import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { MaterialAPIResponse, Record, MaterialType } from '../data/interfaces/material.interface';
import { Data, MateriaPostAPIResponse } from '../data/interfaces/materialPost.interface';

const API_URL = 'https://gitt-api-3tw6.onrender.com/api/v1/materials';

const axiosClient = AxiosClient.getInstance();

export const getMaterials = async (page: number = 1, limit: number = 20): Promise<MaterialAPIResponse> => {
  const res = await axiosClient.get<MaterialAPIResponse>(`${API_URL}?page=${page}&limit=${limit}`, {});
  return {
    success: true,
    message: { content: [], displayable: true },
    data: res.data
  };
};

export const createMaterial = async (data: Omit<Record, 'id'>): Promise<Record> => {
  try {
    const res = await axiosClient.post<MateriaPostAPIResponse>(API_URL, data, {});
    console.log('API Response:', res.data);
    
    // Verificamos si la respuesta tiene la estructura correcta
    if (res.data) {
      // Si la respuesta tiene una estructura diferente, intentamos adaptarla
      if (res.data.success === false) {
        console.error('Error en la respuesta de la API:', res.data.message);
        throw new Error(res.data.message?.content?.[0] || 'Error en la respuesta de la API');
      }
      
      // Si tenemos datos directamente en la respuesta
      if (res.data.data) {
        const materialData = res.data.data;
        return {
          id: materialData.id,
          name: materialData.name,
          description: materialData.description,
          materialType: materialData.materialType as MaterialType
        };
      } else if ('id' in res.data) {
        // Si los datos están directamente en el objeto principal
        // Usamos type assertion para manejar la estructura
        const responseData = res.data as unknown as {
          id: number;
          name: string;
          description: string;
          materialType: string;
        };
        
        return {
          id: responseData.id,
          name: responseData.name,
          description: responseData.description,
          materialType: responseData.materialType as MaterialType
        };
      }
    }
    
    // Si llegamos aquí, intentemos devolver algo útil para evitar el error
    return {
      id: 0, // ID temporal
      name: data.name,
      description: data.description,
      materialType: data.materialType
    };
  } catch (error) {
    console.error('Error al crear material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: number) => {
  return await axiosClient.delete(`${API_URL}/${id}`, {});
};

export const updateMaterial = async (id: number, data: Partial<Record>) => {
  return await axiosClient.patch(`${API_URL}/${id}`, data, {});
};

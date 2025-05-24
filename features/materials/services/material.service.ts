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
  const res = await axiosClient.post<MateriaPostAPIResponse>(API_URL, data, {});
  return {
    ...res.data.data,
    materialType: res.data.data.materialType as MaterialType
  };
};

export const deleteMaterial = async (id: number) => {
  return await axiosClient.delete(`${API_URL}/${id}`, {});
};

export const updateMaterial = async (id: number, data: Partial<Record>) => {
  return await axiosClient.patch(`${API_URL}/${id}`, data, {});
};

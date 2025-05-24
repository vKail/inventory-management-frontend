import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { Material, MaterialAPIResponse, Record } from '../data/interfaces/material.interface';

const API_URL = 'https://gitt-api-3tw6.onrender.com/api/v1/materials';

const axiosClient = AxiosClient.getInstance();

export const getMaterials = async (): Promise<Record[]> => {
  const res = await axiosClient.get<MaterialAPIResponse>(`${API_URL}?page=1&limit=10`, {});
  return res.data.records;
};

export const deleteMaterial = async (id: number) => {
  return await axiosClient.delete(`${API_URL}/${id}`, {});
};

export const updateMaterial = async (id: number, data: Partial<Record>) => {
  return await axiosClient.patch(`${API_URL}/${id}`, data, {});
};

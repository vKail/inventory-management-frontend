import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { MaterialAPIResponse, Record } from '../data/interfaces/material.interface';
import { Data, MateriaPostAPIResponse } from '../data/interfaces/materialPost.interface';

const API_URL = 'https://gitt-api-3tw6.onrender.com/api/v1/materials';

const axiosClient = AxiosClient.getInstance();

export const getMaterials = async (): Promise<Record[]> => {
  const res = await axiosClient.get<MaterialAPIResponse>(`${API_URL}?page=1&limit=10`, {});
  return res.data.records;
};

export const createMaterial = async (data: Omit<Record, 'id'>): Promise<Data> => {
  const res = await axiosClient.post<MateriaPostAPIResponse>(API_URL, data, {});
  return res.data.data;
};

export const deleteMaterial = async (id: number) => {
  return await axiosClient.delete(`${API_URL}/${id}`, {});
};

export const updateMaterial = async (id: number, data: Partial<Record>) => {
  return await axiosClient.patch(`${API_URL}/${id}`, data, {});
};

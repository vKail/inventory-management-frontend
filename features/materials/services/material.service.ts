import axios from 'axios';
import { Material } from '../data/interfaces/material.interface';

const API_URL = 'https://gitt-api-3tw6.onrender.com/api/v1/materials';

export const getMaterials = async () => {
  const res = await axios.get(`${API_URL}?page=1&limit=10`);
  return res.data.data.records;
};

export const deleteMaterial = async (id: number) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export const updateMaterial = async (id: number, data: Partial<Material>) => {
  return await axios.patch(`${API_URL}/${id}`, data);
};

import { useEffect, useState } from 'react';
import { getMaterials, deleteMaterial, createMaterial } from '../services/material.service';
import { Record, MaterialAPIResponse } from '../data/interfaces/material.interface';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchMaterials = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await getMaterials(page, 20);
      setMaterials(response.data.records);
      setTotalPages(response.data.pages);
      setTotalItems(response.data.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error al obtener materiales', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: Omit<Record, 'id'>) => {
    try {
      const newMaterial = await createMaterial(data);
      setMaterials(prevMaterials => [...prevMaterials, newMaterial]);
      return newMaterial;
    } catch (error) {
      console.error('Error al crear material', error);
      throw error;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMaterial(id);
      setMaterials(materials.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error al eliminar material', error);
    }
  };

  const loadAllMaterials = async () => {
    setLoading(true);
    try {
      const response = await getMaterials(1, 100); // Usamos un límite alto para traer todos los datos
      setMaterials(response.data.records);
      setTotalPages(response.data.pages);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error al cargar todos los materiales', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMaterials();
  }, []);

  return { 
    materials, 
    loading, 
    handleCreate, 
    handleDelete,
    currentPage,
    totalPages,
    totalItems,
    fetchMaterials
  };
};

import { useEffect, useState } from 'react';
import { getMaterials, deleteMaterial, createMaterial } from '../services/material.service';
import { Record } from '../data/interfaces/material.interface';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Record[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await getMaterials();
      setMaterials(data);
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

  useEffect(() => {
    fetchMaterials();
  }, []);

  return { materials, loading, handleCreate, handleDelete };
};

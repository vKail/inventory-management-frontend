import { useEffect, useState } from 'react';
import { getMaterials, deleteMaterial } from '../services/material.service';
import { Material } from '../data/interfaces/material.interface';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
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

  return { materials, loading, handleDelete };
};

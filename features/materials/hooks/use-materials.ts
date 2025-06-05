import { useEffect, useState } from 'react';
import { MaterialService } from '../services/material.service';
import { IMaterial } from '../data/interfaces/material.interface';

export const useMaterials = () => {
  const [materials, setMaterials] = useState<IMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await MaterialService.getInstance().getMaterials(page, limit);
      setMaterials(response.records);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Error al cargar los materiales');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await MaterialService.getInstance().deleteMaterial(id);
      await fetchMaterials(); // Refresh the list
    } catch (error) {
      console.error('Error deleting material:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (material: Partial<IMaterial>) => {
    try {
      setLoading(true);
      const response = await MaterialService.getInstance().createMaterial(material);
      await fetchMaterials(); // Refresh the list
      return response;
    } catch (error) {
      console.error('Error creating material:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, material: Partial<IMaterial>) => {
    try {
      setLoading(true);
      const response = await MaterialService.getInstance().updateMaterial(id, material);
      await fetchMaterials(); // Refresh the list
      return response;
    } catch (error) {
      console.error('Error updating material:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return {
    materials,
    loading,
    error,
    fetchMaterials,
    handleDelete,
    handleCreate,
    handleUpdate
  };
};

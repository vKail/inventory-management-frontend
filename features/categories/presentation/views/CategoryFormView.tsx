'use client';

import { useEffect, useState } from 'react';
import { useCategoryStore } from '@/features/categories/context/category-store';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ICategory } from '@/features/categories/data/interfaces/category.interface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryForm({ params }: { params: { id?: string } }) {
  const router = useRouter();
  const isEdit = params.id !== undefined && params.id !== 'new';

  const {
    getCategoryById,
    getCategories,
    addCategory,
    updateCategory,
    loading,
    categories: availableCategories
  } = useCategoryStore();

  const [formData, setFormData] = useState<Omit<ICategory, 'id' | 'active'>>({
    code: '',
    name: '',
    description: '',
    parentCategory: null,
    standardUsefulLife: 0,
    depreciationPercentage: '0.00'
  });

  useEffect(() => {
    const loadData = async () => {
      await getCategories();

      if (isEdit && params.id) {
        const category = await getCategoryById(Number(params.id));
        if (category) {
          const { id, ...rest } = category;
          setFormData(rest);
        }
      }
    };
    loadData();
  }, [isEdit, params.id, getCategories, getCategoryById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || name === 'standardUsefulLife'
        ? Number(value)
        : value
    }));
  };

  const handleParentCategoryChange = (value: string) => {
    if (value === "null") {
      setFormData(prev => ({
        ...prev,
        parentCategory: null
      }));
      return;
    }

    const selectedCategory = availableCategories.find(cat => cat.id.toString() === value);
    setFormData(prev => ({
      ...prev,
      parentCategory: selectedCategory || null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && params.id) {
        // Preparar los datos para la actualización
        const updateData: Partial<ICategory> = {
          code: formData.code,
          name: formData.name,
          description: formData.description,
          parentCategory: formData.parentCategory,
          standardUsefulLife: formData.standardUsefulLife,
          depreciationPercentage: formData.depreciationPercentage
        };

        await updateCategory(Number(params.id), updateData);
        console.log('Categoría actualizada exitosamente');
      } else {
        await addCategory(formData as ICategory);
        console.log('Categoría creada exitosamente');
      }
      router.push('/categories');
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="code">Código</Label>
        <Input id="code" name="code" value={formData.code} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Input id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="parentCategory">Categoría Padre</Label>
        <Select
          value={formData.parentCategory?.id?.toString() || "null"}
          onValueChange={handleParentCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoría padre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">Ninguna</SelectItem>
            {availableCategories
              .filter(cat => cat.id !== Number(params.id)) // Excluir la categoría actual
              .map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="standardUsefulLife">Vida útil estándar (años)</Label>
        <Input id="standardUsefulLife" name="standardUsefulLife" type="number" value={formData.standardUsefulLife} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="depreciationPercentage">Porcentaje de depreciación</Label>
        <Input id="depreciationPercentage" name="depreciationPercentage" value={formData.depreciationPercentage} onChange={handleChange} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
      </Button>
    </form>
  );
}

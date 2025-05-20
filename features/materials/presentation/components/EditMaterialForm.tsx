import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { materialSchema } from '../../data/schemas/material.schema';
import { z } from 'zod';
import { updateMaterial } from '../../services/material.service';

type FormData = z.infer<typeof materialSchema>;

interface Props {
  initialData: FormData;
  materialId: number;
  onSuccess: () => void;
}

export const EditMaterialForm: React.FC<Props> = ({ initialData, materialId, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateMaterial(materialId, data);
      onSuccess();
      window.location.reload(); // Recarga la página automáticamente
    } catch (err) {
      console.error('Error al actualizar material:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nombre:</label>
        <input {...register('name')} className="border rounded px-3 py-2 w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción:</label>
        <input {...register('description')} className="border rounded px-3 py-2 w-full" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Tipo:</label>
        <input {...register('materialType')} className="border rounded px-3 py-2 w-full" />
        {errors.materialType && <p className="text-red-500 text-sm">{errors.materialType.message}</p>}
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Actualizar
      </button>
    </form>
  );
};
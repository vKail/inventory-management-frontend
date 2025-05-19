"use client";
import React, { useState } from 'react';

interface CategoryFormProps {
  onSubmit?: (data: CategoryFormData) => void;
}

interface CategoryFormData {
  code: string;
  name: string;
  description: string;
  parentCategory: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    code: 'EF-CAT001',
    name: '',
    description: '',
    parentCategory: 'Ninguna'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="code">
          Código
        </label>
        <input
          id="code"
          name="code"
          type="text"
          className="w-full border rounded px-3 py-2 bg-gray-100"
          value={formData.code}
          onChange={handleChange}
          readOnly
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full border rounded px-3 py-2"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre de la categoría"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full border rounded px-3 py-2"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción de la categoría"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="parentCategory">
          Categoría Padre
        </label>
        <select
          id="parentCategory"
          name="parentCategory"
          className="w-full border rounded px-3 py-2"
          value={formData.parentCategory}
          onChange={handleChange}
        >
          <option value="Ninguna">Ninguna</option>
          {/* Aquí podrías mapear opciones de categorías existentes */}
        </select>
      </div>
    </form>
  );
};
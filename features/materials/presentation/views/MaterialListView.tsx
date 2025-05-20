import React, { useState } from 'react';
import { useMaterials } from '../../hooks/useMaterials';
import { MaterialTable } from '../components/MaterialTable';
import { EditMaterialForm } from '../components/EditMaterialForm';
import { Material } from '../../data/interfaces/material.interface';

export const MaterialListView = () => {
  const { materials, loading, handleDelete } = useMaterials();
  const [editMaterial, setEditMaterial] = useState<Material | null>(null);

  if (loading) return <p>Cargando materiales...</p>;

  return (
    <div>
      <h1>Lista de Materiales</h1>
      <MaterialTable
        materials={materials}
        onDelete={handleDelete}
        onEdit={(mat) => setEditMaterial(mat)}
      />

      {editMaterial && (
        <EditMaterialForm
          initialData={editMaterial}
          materialId={editMaterial.id}
          onSuccess={() => setEditMaterial(null)}
        />
      )}
    </div>
  );
};

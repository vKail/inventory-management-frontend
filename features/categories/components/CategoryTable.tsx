'use client';

import { Table } from '@/shared/components/ui/Table';
import { Category } from '../types/category.types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoryTableProps {
  data: Category[];
}

export function CategoryTable({ data }: CategoryTableProps) {
  // Extiende el tipo Category para incluir la columna "actions" solo para la tabla
  type CategoryTableColumnKey = keyof Category | 'actions';

  const columns: {
    key: CategoryTableColumnKey;
    header: string;
    render?: (value: any, row?: Category) => React.ReactNode;
  }[] = [
    { key: 'code', header: 'Código' },
    { key: 'name', header: 'Nombre' },
    { key: 'description', header: 'Descripción' },
    { 
      key: 'parent', 
      header: 'Categoría Padre',
      render: (value: string | null) => value || 'Ninguna'
    },
    { key: 'lifespan', header: 'Vida Útil (años)' },
    { 
      key: 'depreciation', 
      header: 'Depreciación (%)',
      render: (value: number) => `${value.toFixed(2)}%`
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_: any, row?: Category) => (
        <div className="flex gap-3">
          
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Editar"
            title="Editar"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button 
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Eliminar"
            title="Eliminar"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  // @ts-expect-error: "actions" column is not part of Category, but is needed for UI actions
  return <Table columns={columns} data={data} />;
}
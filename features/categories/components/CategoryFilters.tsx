// features/categories/components/CategoryFilters.tsx
'use client';

import { Button } from '@/shared/components/ui/Button';
import {  Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import { SearchIcon, FilterIcon } from 'lucide-react';

export function CategoryFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        placeholder="Buscar por nombre o código..."
        icon={<SearchIcon size={16} />}
      />
      <Select
        options={[
          { value: 'all', label: 'Todas las categorías padre' },
          { value: 'none', label: 'Sin categoría padre' }
        ]}
        icon={<FilterIcon size={16} />}
      />
      <div className="flex gap-2">
        <Button variant="outline" className="w-full">
          Limpiar
        </Button>
        <Button className="w-full">
          Buscar
        </Button>
      </div>
    </div>
  );
}
// /features/inventory/components/inventory-filter-bar.tsx
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { InventoryFilters } from '@/features/inventory/data/interfaces/inventory.interface';

interface Props {
  onFilterChange: (filters: InventoryFilters) => void;
  onClear: () => void;
}

export const InventoryFilterBar = ({ onFilterChange, onClear }: Props) => {
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: '',
    department: '',
    state: '',
    sortBy: 'nameAsc',
  });

  const handleChange = (field: keyof InventoryFilters, value: string) => {
    const updatedFilters = {
      ...filters,
      [field]: value === 'all' ? '' : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full flex-wrap">
          {/* Campo de búsqueda */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar producto..."
              value={filters.search || ''}
              onChange={e => handleChange('search', e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          {/* Selector de categoría */}
          <Select
            value={filters.category || 'all'}
            onValueChange={value => handleChange('category', value)}
          >
            <SelectTrigger className="w-full md:w-40 h-10">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="technology">Tecnología</SelectItem>
              <SelectItem value="electronics">Electrónica</SelectItem>
              <SelectItem value="furniture">Muebles</SelectItem>
              <SelectItem value="tools">Herramientas</SelectItem>
            </SelectContent>
          </Select>

          {/* Selector de departamento */}
          <Select
            value={filters.department || 'all'}
            onValueChange={value => handleChange('department', value)}
          >
            <SelectTrigger className="w-full md:w-40 h-10">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              <SelectItem value="computing">Computación</SelectItem>
              <SelectItem value="electronics">Electrónica</SelectItem>
              <SelectItem value="design">Diseño</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>

          {/* Selector de estado */}
          <Select
            value={filters.state || 'all'}
            onValueChange={value => handleChange('state', value)}
          >
            <SelectTrigger className="w-full md:w-40 h-10">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="in_use">En Uso</SelectItem>
              <SelectItem value="maintenance">Mantenimiento</SelectItem>
              <SelectItem value="damaged">Dañado</SelectItem>
            </SelectContent>
          </Select>

          {/* Selector de orden */}
          <Select
            value={filters.sortBy || 'nameAsc'}
            onValueChange={value => handleChange('sortBy', value)}
          >
            <SelectTrigger className="w-full md:w-40 h-10">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Más reciente</SelectItem>
              <SelectItem value="oldest">Más antiguo</SelectItem>
              <SelectItem value="nameAsc">Nombre A-Z</SelectItem>
              <SelectItem value="nameDesc">Nombre Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Botón de filtro avanzado */}
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-5 w-5" />
          </Button>

          {/* Botón de limpiar filtros */}
          <Button
            variant="ghost"
            onClick={onClear}
            className="text-xs hover:text-primary flex items-center gap-1 whitespace-nowrap"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Limpiar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

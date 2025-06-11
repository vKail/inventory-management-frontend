"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserFilterProps {
  onFilterChange: (filters: { userName?: string; dni?: string; status?: string }) => void;
}

export function UserFilter({ onFilterChange }: UserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState('');
  const [searchByDni, setSearchByDni] = useState(false);
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');

  // Inicializar valores desde la URL
  useEffect(() => {
    const userName = searchParams.get('userName');
    const dni = searchParams.get('dni');
    const statusParam = searchParams.get('status');

    if (userName) {
      setSearchValue(userName);
      setSearchByDni(false);
    } else if (dni) {
      setSearchValue(dni);
      setSearchByDni(true);
    }

    if (statusParam) {
      setStatus(statusParam);
    } else {
      setStatus('ALL');
    }
  }, [searchParams]);

  useEffect(() => {
    const filters: { userName?: string; dni?: string; status?: string } = {};

    if (searchValue.trim()) {
      if (searchByDni) {
        filters.dni = searchValue.trim();
      } else {
        filters.userName = searchValue.trim();
      }
    }

    if (status && status !== 'ALL') {
      filters.status = status;
    }

    onFilterChange(filters);
  }, [searchValue, searchByDni, status, onFilterChange]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    // Limpiar los parámetros existentes de filtros
    params.delete('userName');
    params.delete('dni');
    params.delete('status');
    params.delete('page'); // Resetear a la primera página cuando se filtra

    // Agregar nuevos filtros si tienen valor
    if (searchValue.trim()) {
      if (searchByDni) {
        params.set('dni', searchValue.trim());
      } else {
        params.set('userName', searchValue.trim());
      }
    }

    if (status && status !== 'ALL') {
      params.set('status', status);
    }

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchValue('');
    setSearchByDni(false);
    setStatus('ALL');

    const params = new URLSearchParams(searchParams);
    params.delete('userName');
    params.delete('dni');
    params.delete('status');
    params.delete('page');

    router.push(`?${params.toString()}`);
  };

  const hasFilters = searchValue.trim() || (status && status !== 'ALL');

  return (
    <Card className="mb-6 w-full">
      <CardContent className="pt-6 flex justify-between w-full">
        <div className="flex flex-col gap-4">
          <p className='text-2xl font-bold'>Filtros activos:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Buscar usuario
              </Label>
              <Input
                className='w-4xl mr-24'
                id="search"
                placeholder={searchByDni ? "Buscar por DNI..." : "Buscar por nombre de usuario..."}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="w-full sm:w-48">
              <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                Estado
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos los estados</SelectItem>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="searchByDni"
              checked={searchByDni}
              onCheckedChange={(checked) => setSearchByDni(checked as boolean)}
            />
            <Label
              htmlFor="searchByDni"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Buscar por DNI en lugar de nombre de usuario
            </Label>
          </div> */}

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!hasFilters}
              size="sm"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
            <Button
              onClick={handleSearch}
              size="sm"
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

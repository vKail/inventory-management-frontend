import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface LocationFilters {
  name: string;
  floor: string;
  type: string;
}

interface LocationFilterProps {
  filters: LocationFilters;
  onSearch: (filters: LocationFilters) => void;
  onClear: () => void;
}

export function LocationFilter({ filters, onSearch, onClear }: LocationFilterProps) {
  const [localFilters, setLocalFilters] = useState<LocationFilters>(filters);

  const handleSearch = () => {
    onSearch(localFilters);
  };

  const handleClear = () => {
    const clearedFilters: LocationFilters = {
      name: '',
      floor: '',
      type: 'ALL',
    };
    setLocalFilters(clearedFilters);
    onClear();
  };

  const typeOptions = [
    { value: 'ALL', label: 'Todos los tipos' },
    { value: 'WAREHOUSE', label: 'Almacén' },
    { value: 'BUILDING', label: 'Edificio' },
    { value: 'FLOOR', label: 'Piso' },
    { value: 'OFFICE', label: 'Oficina' },
    { value: 'SHELF', label: 'Estantería' },
    { value: 'LABORATORY', label: 'Laboratorio' },
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Buscar por nombre..."
              value={localFilters.name}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, name: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">Piso</Label>
            <Input
              id="floor"
              placeholder="Buscar por piso..."
              value={localFilters.floor}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, floor: e.target.value })
              }
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={localFilters.type}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button onClick={handleClear} variant="outline">
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

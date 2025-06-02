"use client";

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, MapPin } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLocationStore } from '@/features/locations/context/location-store';
import { useWarehouseStore } from '@/features/warehouses/context/warehouse-store';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Definimos los tipos de ubicación disponibles
const LocationTypes = {
  BUILDING: "BUILDING",
  FLOOR: "FLOOR",
  OFFICE: "OFFICE",
  WAREHOUSE: "WAREHOUSE",
  SHELF: "SHELF",
  LABORATORY: "LABORATORY",
} as const;

interface LocationTableProps {
  currentPage: number;
  itemsPerPage: number;
}

export function LocationTable({ currentPage, itemsPerPage }: LocationTableProps) {
  const router = useRouter();
  const {
    locations,
    isLoading,
    getLocations,
    deleteLocation
  } = useLocationStore();

  const { warehouses, getWarehouses } = useWarehouseStore();

  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          getLocations(currentPage, itemsPerPage),
          getWarehouses()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      }
    };

    loadData();
  }, [getLocations, getWarehouses, currentPage, itemsPerPage]);

  const handleDelete = async () => {
    if (locationToDelete === null) return;

    try {
      await deleteLocation(locationToDelete);
      toast.success('Ubicación eliminada exitosamente');
      setLocationToDelete(null);
    } catch (error) {
      console.error('Error deleting location:', error);
      toast.error('Error al eliminar la ubicación');
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/locations/edit/${id}`);
  };

  const getWarehouseName = (warehouseId: number) => {
    const warehouse = warehouses.find(w => w.id === warehouseId);
    return warehouse?.name || 'No asignado';
  };

  // Filtrar las ubicaciones basado en la búsqueda y el tipo seleccionado
  const filteredLocations = locations.filter(location => {
    const matchesSearch = searchTerm === '' ||
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.floor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'all' || location.type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader className="px-4 md:px-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
            <Input
              placeholder="Buscar por nombre o piso..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.entries(LocationTypes).map(([key, value]) => (
                  <SelectItem key={value} value={value}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => router.push('/locations/new')}
            className="bg-red-600 hover:bg-red-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Ubicación
          </Button>
        </div>
        <hr className="border-t border-muted mt-4" />
      </CardHeader>

      <CardContent className="px-4 md:px-8 pb-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Almacén</TableHead>
                <TableHead>Piso</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Ocupación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading.fetch ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex items-center justify-center">
                      Cargando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="mb-2">No hay ubicaciones para mostrar</p>
                      <Button
                        onClick={() => router.push('/locations/new')}
                        variant="outline"
                        size="sm"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear primera ubicación
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>{location.name}</TableCell>
                    <TableCell>{location.type}</TableCell>
                    <TableCell>{getWarehouseName(location.warehouseId)}</TableCell>
                    <TableCell>{location.floor}</TableCell>
                    <TableCell>{location.reference}</TableCell>
                    <TableCell>{`${location.capacity} ${location.capacityUnit}`}</TableCell>
                    <TableCell>
                      <Badge variant={location.occupancy < location.capacity ? "default" : "default"}>
                        {location.occupancy}/{location.capacity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(location.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLocationToDelete(location.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la ubicación.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setLocationToDelete(null)}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

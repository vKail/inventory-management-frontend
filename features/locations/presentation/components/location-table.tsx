"use client";

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, MapPin, X } from 'lucide-react';
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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import LoaderComponent from '@/shared/components/ui/Loader';
import { LocationPagination } from './location-pagination';

// Definimos los tipos de ubicación disponibles
const LocationTypes = {
  BUILDING: "Edificio",
  FLOOR: "Piso",
  OFFICE: "Oficina",
  WAREHOUSE: "Almacen",
  SHELF: "Estante",
  LABORATORY: "Laboratorio",
} as const;

export function LocationTable() {
  const router = useRouter();
  const {
    filteredLocations,
    searchTerm,
    typeFilter,
    isLoading,
    getLocations,
    deleteLocation,
    setSearchTerm,
    setTypeFilter,
    clearFilters,
    currentPage,
    totalPages
  } = useLocationStore();

  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await getLocations(currentPage, 10);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      }
    };

    loadData();
  }, [getLocations, currentPage]);

  const handlePageChange = async (page: number) => {
    try {
      await getLocations(page, 10);
    } catch (error) {
      console.error('Error changing page:', error);
      toast.error('Error al cambiar de página');
    }
  };

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

  return (
    <Card className="w-full max-w-[1200px]">
      <CardHeader className="px-4 md:px-8 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Input
              placeholder="Buscar por nombre, descripción, piso o referencia..."
              className="w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.entries(LocationTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm || typeFilter !== 'all') && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10"
                onClick={clearFilters}
                title="Limpiar todos los filtros"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            onClick={() => router.push('/locations/new')}
            className="bg-red-600 hover:bg-red-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Ubicación
          </Button>
        </div>
        <hr className="border-t border-muted mt-3" />
      </CardHeader>

      <CardContent className="px-4 md:px-8 pb-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
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
                  <TableCell colSpan={7}>
                    <LoaderComponent rows={5} columns={7} />
                  </TableCell>
                </TableRow>
              ) : filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <MapPin className="h-10 w-10 opacity-30 mb-2" />
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
                    <TableCell>{LocationTypes[location.type as keyof typeof LocationTypes] || location.type}</TableCell>
                    <TableCell>{location.floor}</TableCell>
                    <TableCell>{location.reference}</TableCell>
                    <TableCell>{`${location.capacity} ${location.capacityUnit}`}</TableCell>
                    <TableCell>
                      <Badge variant={location.occupancy && location.capacity && location.occupancy < location.capacity ? "default" : "default"}>
                        {location.occupancy}/{location.capacity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(location.id ?? 0)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setLocationToDelete(location.id ?? 0)}
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
          {!isLoading.fetch && filteredLocations.length > 0 && (
            <div className="mt-4">
              <LocationPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

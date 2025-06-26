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
import { formatNullValue, capitalizeWords } from '@/lib/utils';
import { LocationTypeLabels, CapacityUnitLabels } from '@/features/locations/data/interfaces/location.interface';

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

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "Sin datos";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card className="w-full max-w-[1400px]">
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
                {Object.entries(LocationTypeLabels).map(([key, value]) => (
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
            variant="default"
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Ubicación
          </Button>
        </div>
        <hr className="border-t border-muted mt-3" />
      </CardHeader>

      <CardContent className="px-4 md:px-8 pb-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Nombre</TableHead>
                  <TableHead className="w-[200px]">Descripción</TableHead>
                  <TableHead className="w-[120px]">Tipo</TableHead>
                  <TableHead className="w-[100px]">Piso</TableHead>
                  <TableHead className="w-[120px]">Referencia</TableHead>
                  <TableHead className="w-[100px]">Capacidad</TableHead>
                  <TableHead className="w-[100px]">Ocupación</TableHead>
                  <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading.fetch ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <LoaderComponent rows={5} columns={8} />
                    </TableCell>
                  </TableRow>
                ) : filteredLocations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
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
                    <TableRow key={location.id} className="h-16">
                      <TableCell className="font-medium">
                        {formatNullValue(capitalizeWords(location.name), "Sin nombre")}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={location.description}>
                          {formatNullValue(truncateText(location.description, 50), "Sin descripción")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {LocationTypeLabels[location.type] || location.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatNullValue(capitalizeWords(location.floor), "Sin piso")}
                      </TableCell>
                      <TableCell>
                        {formatNullValue(capitalizeWords(location.reference), "Sin referencia")}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium">{location.capacity}</span>
                          <span className="text-muted-foreground ml-1">
                            {CapacityUnitLabels[location.capacityUnit]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <span className="font-medium">{location.occupancy}</span>
                          <span className="text-muted-foreground ml-1">
                            {CapacityUnitLabels[location.capacityUnit]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(location.id!)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setLocationToDelete(location.id!)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente la ubicación
                                  <span className="font-semibold"> {formatNullValue(capitalizeWords(location.name), "Sin nombre")}</span>.
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

"use client";

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, MapPin, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter
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
    <Card className="w-full">
      <CardHeader className="px-2 sm:px-4 md:px-8 pb-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto py-2 mb-4">
            <Input
              placeholder="Buscar por nombre..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-full sm:w-56">
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
                onClick={clearFilters}
                className="h-10 w-10 cursor-pointer"
                title="Limpiar filtros"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button
            onClick={() => router.push('/locations/new')}
            className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Ubicación
          </Button>
        </div>
        <hr className="border-t border-muted mt-4" />
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-8 pb-6">
        <div className="min-h-[400px] flex flex-col justify-between">
          <div className="overflow-x-auto border rounded-md shadow-sm">
            <div className="min-w-full inline-block align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] w-[15%]">Nombre</TableHead>
                    <TableHead className="min-w-[200px] w-[25%]">Descripción</TableHead>
                    <TableHead className="min-w-[100px] w-[10%]">Tipo</TableHead>
                    <TableHead className="min-w-[100px] w-[10%]">Piso</TableHead>
                    <TableHead className="min-w-[120px] w-[15%]">Referencia</TableHead>
                    <TableHead className="min-w-[100px] w-[10%]">Capacidad</TableHead>
                    <TableHead className="min-w-[100px] w-[10%]">Ocupación</TableHead>
                    <TableHead className="min-w-[100px] w-[5%] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading.fetch ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24">
                        <LoaderComponent rows={5} columns={8} />
                      </TableCell>
                    </TableRow>
                  ) : filteredLocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2">
                          <MapPin className="h-10 w-10 opacity-30" />
                          <span>No hay ubicaciones para mostrar</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLocations.map((location) => (
                      <TableRow key={location.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium max-w-[120px] truncate" title={location.name}>
                          {formatNullValue(capitalizeWords(truncateText(location.name, 40)), "Sin nombre")}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={location.description}>
                          {formatNullValue(capitalizeWords(truncateText(location.description, 60)), "Sin descripción")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {LocationTypeLabels[location.type] || location.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[100px] truncate" title={location.floor}>
                          {formatNullValue(capitalizeWords(truncateText(location.floor, 20)), "Sin piso")}
                        </TableCell>
                        <TableCell className="max-w-[120px] truncate" title={location.reference}>
                          {formatNullValue(capitalizeWords(truncateText(location.reference, 30)), "Sin referencia")}
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
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(location.id!)}
                              className="cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setLocationToDelete(location.id!)}
                                  className="cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la ubicación
                                    <span className="font-semibold"> {formatNullValue(capitalizeWords(truncateText(location.name, 40)), "Sin nombre")}</span>.
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

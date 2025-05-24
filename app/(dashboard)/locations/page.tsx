'use client'

import { useEffect, useState } from "react";
import { Location } from "@/features/locations/data/interfaces/location.interface";
import { LocationService } from "@/features/locations/services/location.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { createColumns } from "./columns";
import { LocationDialog } from "@/features/locations/presentation/components/location-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const data = await LocationService.getInstance().getAllLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las ubicaciones.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLocation) return;

    try {
      await LocationService.getInstance().deleteLocation(selectedLocation.id);
      toast({
        title: "Ubicación eliminada",
        description: "La ubicación ha sido eliminada correctamente.",
      });
      loadLocations();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la ubicación.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedLocation(null);
    }
  };

  const handleEdit = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleDeleteClick = (location: Location) => {
    setSelectedLocation(location);
    setDeleteDialogOpen(true);
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDeleteClick,
  });

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ubicaciones</CardTitle>
          <LocationDialog onSuccess={loadLocations} />
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={locations}
            loading={loading}
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la ubicación
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedLocation && (
        <LocationDialog
          location={selectedLocation}
          onSuccess={() => {
            loadLocations();
            setSelectedLocation(null);
          }}
        />
      )}
    </div>
  );
} 
'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationForm } from "./location-form";
import { CreateLocationDto, Location, UpdateLocationDto } from "../../data/interfaces/location.interface";
import { LocationService } from "../../services/location.service";
import { useToast } from "@/components/ui/use-toast";

interface LocationDialogProps {
  location?: Location;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function LocationDialog({ location, onSuccess, trigger }: LocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: CreateLocationDto | UpdateLocationDto) => {
    try {
      setIsLoading(true);
      if (location) {
        await LocationService.getInstance().updateLocation(location.id, data as UpdateLocationDto);
        toast({
          title: "Ubicación actualizada",
          description: "La ubicación ha sido actualizada correctamente.",
        });
      } else {
        await LocationService.getInstance().createLocation(data as CreateLocationDto);
        toast({
          title: "Ubicación creada",
          description: "La ubicación ha sido creada correctamente.",
        });
      }
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al guardar la ubicación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => {
      if (!open) setOpen(false);
    }}>
      <DialogTrigger asChild>
        {trigger || <Button>Nueva Ubicación</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {location ? "Editar Ubicación" : "Nueva Ubicación"}
          </DialogTitle>
          <DialogDescription>
            {location
              ? "Modifica los datos de la ubicación."
              : "Ingresa los datos de la nueva ubicación."}
          </DialogDescription>
        </DialogHeader>
        <LocationForm
          initialData={location}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
} 
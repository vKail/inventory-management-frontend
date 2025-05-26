"use client";

import { LocationForm } from "@/features/locations/presentation/components/location-form";
import { useLocationStore } from "@/features/locations/context/location-store";
import { useRouter } from "next/navigation";
import { LocationFormValues } from "@/features/locations/data/schemas/location.schema";
import { toast } from "sonner";

export default function NewLocationPage() {
  const router = useRouter();
  const { addLocation, isLoading } = useLocationStore();

  const handleSubmit = async (data: LocationFormValues) => {
    try {
      await addLocation(data as any); // Temporal fix for type issue
      toast.success("Ubicación creada exitosamente");
      router.push("/locations");
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Error al crear la ubicación");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <LocationForm onSubmit={handleSubmit} isLoading={isLoading.create} />
    </div>
  );
}

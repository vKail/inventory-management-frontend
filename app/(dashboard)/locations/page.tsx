import LocationView from "@/features/locations/presentation/views/location-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ubicaciones | Inventory Management",
  description: "Gestión de ubicaciones del sistema",
};

export default function LocationsPage() {
  return <LocationView />;
} 
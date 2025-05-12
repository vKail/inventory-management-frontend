import * as z from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  warehouseId: z.number().min(1, "La bodega es obligatoria"),
  parentLocationId: z.number().nullable(),
  type: z.string().min(1, "El tipo es obligatorio"),
  building: z.string().min(1, "El edificio es obligatorio"),
  floor: z.string().min(1, "El piso es obligatorio"),
  reference: z.string().min(1, "La referencia es obligatoria"),
  capacity: z.number().min(0, "La capacidad debe ser al menos 0"),
  capacityUnit: z.string().min(1, "La unidad de capacidad es obligatoria"),
  occupancy: z.number().min(0, "La ocupación debe ser al menos 0"),
  qrCode: z.string().min(1, "El código QR es obligatorio"),
  coordinates: z.string().min(1, "Las coordenadas son obligatorias"),
  notes: z.string().optional(),
  active: z.boolean(),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

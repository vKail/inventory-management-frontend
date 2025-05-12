import * as z from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  warehouseId: z.number().min(1, "Warehouse is required"),
  parentLocationId: z.number().nullable(),
  type: z.string().min(1, "Type is required"),
  building: z.string().min(1, "Building is required"),
  floor: z.string().min(1, "Floor is required"),
  reference: z.string().min(1, "Reference is required"),
  capacity: z.number().min(0, "Capacity must be at least 0"),
  capacityUnit: z.string().min(1, "Capacity unit is required"),
  occupancy: z.number().min(0, "Occupancy must be at least 0"),
  qrCode: z.string().min(1, "QR Code is required"),
  coordinates: z.string().min(1, "Coordinates are required"),
  notes: z.string().optional(),
  active: z.boolean(),
});

export type LocationFormValues = z.infer<typeof locationSchema>;

import { z } from "zod";

const LocationType = z.enum([
    "Edificio",
    "Piso",
    "Oficina",
    "Almacen",
    "Estante",
    "Laboratorio"
]);

const CapacityUnit = z.enum([
    "Unidades",
    "Metros",
    "Metros cuadrados"
]);

export const locationSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    parentLocationId: z.number().nullable(),
    type: LocationType,
    building: z.string().min(1, "El edificio es requerido"),
    floor: z.string().min(1, "El piso es requerido"),
    reference: z.string().min(1, "La referencia es requerida"),
    capacity: z.number().min(0, "La capacidad debe ser mayor o igual a 0"),
    capacityUnit: CapacityUnit,
    occupancy: z.number().min(0, "La ocupación debe ser mayor o igual a 0"),
    qrCode: z.string().optional(),
    coordinates: z.string().optional(),
    notes: z.string().optional(),
});

export type LocationFormValues = z.infer<typeof locationSchema>; 
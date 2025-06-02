import { z } from 'zod';
import { LocationTypeLabels, CapacityUnitLabels } from '../data/interfaces/location.interface';

export const locationSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().min(1, 'La descripción es requerida'),
    parentLocationId: z.number().nullable(),
    type: z.enum(['WAREHOUSE', 'BUILDING', 'FLOOR', 'OFFICE', 'SHELF', 'LABORATORY'], {
        errorMap: () => ({ message: 'Tipo de ubicación inválido' })
    }),
    floor: z.string(),
    reference: z.string(),
    capacity: z.number().min(0, 'La capacidad debe ser mayor o igual a 0'),
    capacityUnit: z.enum(['UNITS', 'METERS', 'SQUARE_METERS'], {
        errorMap: () => ({ message: 'Unidad de capacidad inválida' })
    }),
    occupancy: z.number().min(0, 'La ocupación debe ser mayor o igual a 0'),
    qrCode: z.string(),
    coordinates: z.string(),
    notes: z.string()
});

export type LocationFormValues = z.infer<typeof locationSchema>; 
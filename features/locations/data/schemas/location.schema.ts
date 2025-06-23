import { z } from "zod";

export const locationSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().min(1, 'La descripción es requerida').max(500, 'La descripción no puede exceder 500 caracteres'),
    parentLocationId: z.number().nullable(),
    type: z.enum(['BUILDING', 'FLOOR', 'OFFICE', 'WAREHOUSE', 'SHELF', 'LABORATORY'], {
        errorMap: () => ({ message: 'Tipo de ubicación inválido' })
    }),
    floor: z.string().max(50, 'El piso no puede exceder 50 caracteres').nullable().optional(),
    reference: z.string().min(1, 'La referencia es requerida').max(150, 'La referencia no puede exceder 150 caracteres'),
    capacity: z.number().min(0, 'La capacidad debe ser mayor o igual a 0'),
    capacityUnit: z.enum(['UNITS', 'METERS', 'SQUARE_METERS'], {
        errorMap: () => ({ message: 'Unidad de capacidad inválida' })
    }),
    occupancy: z.number().min(0, 'La ocupación debe ser mayor o igual a 0'),
    notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional()
});

export type LocationFormValues = z.infer<typeof locationSchema>; 
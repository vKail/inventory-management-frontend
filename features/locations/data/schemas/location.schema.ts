import { z } from "zod";

const simpleTextRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]+$/;

export const locationSchema = z.object({
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(30, 'El nombre no puede exceder 30 caracteres')
        .refine((value) => simpleTextRegex.test(value.trim()), 'El nombre solo puede contener letras, números, espacios, guion (-) y guion bajo (_)'),
    description: z.string()
        .min(1, 'La descripción es requerida')
        .max(250, 'La descripción no puede exceder 250 caracteres')
        .refine((value) => simpleTextRegex.test(value.trim()), 'La descripción solo puede contener letras, números, espacios, guion (-) y guion bajo (_)'),
    parentLocationId: z.number().nullable(),
    type: z.enum(['BUILDING', 'FLOOR', 'OFFICE', 'WAREHOUSE', 'SHELF', 'LABORATORY'], {
        errorMap: () => ({ message: 'Tipo de ubicación inválido' })
    }),
    floor: z.string()
        .max(50, 'El piso no puede exceder 50 caracteres')
        .refine((value) => {
            if (!value || value.trim() === "") return true;
            // Allow numbers, letters, dash (-) and underscore (_)
            const floorRegex = /^[a-zA-Z0-9\-_]+$/;
            return floorRegex.test(value.trim());
        }, "El piso debe contener solo letras, números, guiones (-) y guiones bajos (_)")
        .nullable()
        .optional(),
    reference: z.string()
        .min(1, 'La referencia es requerida')
        .max(150, 'La referencia no puede exceder 150 caracteres')
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            // Allow numbers, letters, dash (-), underscore (_) and spaces
            const referenceRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]+$/;
            return referenceRegex.test(value.trim());
        }, "La referencia debe contener solo letras, números, guiones (-), guiones bajos (_) y espacios"),
    capacity: z.number().min(1, 'La capacidad debe ser mayor o igual a 1'),
    capacityUnit: z.enum(['UNITS', 'METERS', 'SQUARE_METERS'], {
        errorMap: () => ({ message: 'Unidad de capacidad inválida' })
    }),
    occupancy: z.number()
        .min(0, "La ocupación no puede ser negativa")
        .max(999999, "La ocupación no puede exceder 999,999"),
    notes: z.string()
        .max(250, "Las notas no pueden exceder 250 caracteres")
        .refine((value) => {
            if (!value || value.trim() === "") return true;
            return simpleTextRegex.test(value.trim());
        }, "Las notas solo pueden contener letras, números, espacios, guion (-) y guion bajo (_)")
}).refine((data) => data.capacity >= data.occupancy, {
    message: "La capacidad debe ser mayor o igual a la ocupación",
    path: ["capacity"],
}).refine((data) => data.occupancy <= data.capacity, {
    message: "La ocupación no puede ser mayor que la capacidad",
    path: ["occupancy"],
});

export type LocationFormValues = z.infer<typeof locationSchema>; 
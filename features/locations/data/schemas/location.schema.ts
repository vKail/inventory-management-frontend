import { z } from "zod";

const textRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,;:!?()\-_/@]+$/;

export const locationSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string().min(1, 'La descripción es requerida').max(500, 'La descripción no puede exceder 500 caracteres'),
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
            // Allow numbers, letters, dash (-) and underscore (_)
            const referenceRegex = /^[a-zA-Z0-9\-_]+$/;
            return referenceRegex.test(value.trim());
        }, "La referencia debe contener solo letras, números, guiones (-) y guiones bajos (_)"),
    capacity: z.number().min(0, 'La capacidad debe ser mayor o igual a 0'),
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
            return textRegex.test(value.trim());
        }, "Las notas deben contener solo letras, números, espacios y caracteres válidos (.,;:!?()_-@/)"),
}).refine((data) => data.capacity >= data.occupancy, {
    message: "La capacidad debe ser mayor o igual a la ocupación",
    path: ["capacity"],
}).refine((data) => data.occupancy <= data.capacity, {
    message: "La ocupación no puede ser mayor que la capacidad",
    path: ["occupancy"],
});

export type LocationFormValues = z.infer<typeof locationSchema>; 
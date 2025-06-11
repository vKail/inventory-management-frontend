import { z } from 'zod';

export const itemTypeSchema = z.object({
    code: z.string()
        .min(1, 'El código es requerido')
        .max(50, 'El código no puede tener más de 50 caracteres'),
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede tener más de 100 caracteres'),
    description: z.string()
        .min(1, 'La descripción es requerida')
        .max(500, 'La descripción no puede tener más de 500 caracteres'),
    active: z.boolean().optional()
});

export type ItemTypeFormValues = z.infer<typeof itemTypeSchema>; 
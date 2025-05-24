import { z } from 'zod';

export const conditionSchema = z.object({
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede tener más de 100 caracteres'),
    description: z.string()
        .min(1, 'La descripción es requerida')
        .max(500, 'La descripción no puede tener más de 500 caracteres'),
    requiresMaintenance: z.boolean()
});

export type ConditionFormValues = z.infer<typeof conditionSchema>; 
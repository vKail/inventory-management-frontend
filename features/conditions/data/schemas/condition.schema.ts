import { z } from 'zod';

export const conditionSchema = z.object({
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(25, 'El nombre no puede exceder 25 caracteres')
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            return textRegex.test(value.trim());
        }, 'El nombre debe contener solo letras y espacios'),
    description: z.string()
        .min(1, 'La descripción es requerida')
        .max(250, 'La descripción no puede exceder 250 caracteres')
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            // Permite letras, números, espacios y signos de puntuación básicos para descripciones
            const descriptionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?()\-_]+$/;
            return descriptionRegex.test(value.trim());
        }, 'La descripción debe contener solo letras, números, espacios y signos de puntuación válidos'),
    requiresMaintenance: z.boolean()
});

export type ConditionFormValues = z.infer<typeof conditionSchema>; 
import { z } from "zod";

export const stateSchema = z.object({
    name: z.string()
        .min(1, "El nombre es requerido")
        .max(25, "El nombre no puede exceder 25 caracteres")
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            return textRegex.test(value.trim());
        }, "El nombre debe contener solo letras y espacios"),
    description: z.string()
        .min(1, "La descripción es requerida")
        .max(250, "La descripción no puede exceder 250 caracteres")
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            // Allow letters, numbers, spaces, and common punctuation: . , ; : ! ? ( ) - _ ' "
            const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!\?()\-_'"]+$/;
            return textRegex.test(value.trim());
        }, "La descripción solo puede contener letras, números, espacios y los caracteres . , ; : ! ? ( ) - _ ' \"")
});

export type StateFormValues = z.infer<typeof stateSchema>; 
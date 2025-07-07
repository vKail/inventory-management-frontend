import { z } from 'zod';

const nameRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]+$/;
const descRegex = /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s\(\);:,\.?!]+$/;

export const itemTypeSchema = z.object({
    code: z.string()
        .min(1, 'El código es requerido')
        .max(10, 'El código no puede exceder 10 caracteres')
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            const codeRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\-\s]+$/;
            return codeRegex.test(value.trim());
        }, 'El código solo puede contener letras, espacios y guion (-)'),
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(25, 'El nombre no puede exceder 25 caracteres')
        .refine((value) => nameRegex.test(value.trim()), 'El nombre solo puede contener letras, números, espacios, guion (-) y guion bajo (_)'),
    description: z.string()
        .min(1, 'La descripción es requerida')
        .max(250, 'La descripción no puede exceder 250 caracteres')
        .refine((value) => descRegex.test(value.trim()), 'La descripción solo puede contener letras, números, espacios, guion (-), guion bajo (_), paréntesis (), punto (.), coma (,), dos puntos (:), punto y coma (;), signo de interrogación (?) y signo de exclamación (!)'),
});

export type ItemTypeFormValues = z.infer<typeof itemTypeSchema>; 
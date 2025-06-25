import { z } from 'zod';

export const CertificateType = z.enum(['ENTRY', 'EXIT', 'TRANSFER']);
export const CertificateStatus = z.enum(['DRAFT', 'APPROVED', 'CANCELLED']);

export const certificateSchema = z.object({
    number: z.number()
        .min(1, 'El número es requerido')
        .max(999999999, 'El número no puede tener más de 9 dígitos'),
    date: z.string()
        .min(1, 'La fecha es requerida')
        .max(10, 'La fecha debe tener el formato YYYY-MM-DD')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD'),
    type: CertificateType,
    status: CertificateStatus,
    deliveryResponsibleId: z.number()
        .min(1, 'El responsable de entrega es requerido'),
    receptionResponsibleId: z.number()
        .min(1, 'El responsable de recepción es requerido'),
    observations: z.string()
        .min(1, 'Las observaciones son requeridas')
        .max(250, 'Las observaciones no pueden exceder 250 caracteres')
        .refine((value) => {
            if (!value || value.trim() === "") return false;
            // Permite letras, números, espacios y signos de puntuación básicos para observaciones
            const observationsRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?()\-_]+$/;
            return observationsRegex.test(value.trim());
        }, "Las observaciones deben contener solo letras, números, espacios y signos de puntuación válidos"),
    accounted: z.boolean()
});

export type CertificateFormValues = z.infer<typeof certificateSchema>; 
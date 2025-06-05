import { z } from 'zod';

export const CertificateType = z.enum(['TRANSFER', 'PURCHASE', 'DONATION', 'MANUFACTURING']);
export const CertificateStatus = z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED']);

export const certificateSchema = z.object({
    number: z.number()
        .min(1, 'El número es requerido'),
    date: z.string()
        .min(1, 'La fecha es requerida')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener el formato YYYY-MM-DD'),
    type: CertificateType,
    status: CertificateStatus,
    deliveryResponsibleId: z.number()
        .min(1, 'El responsable de entrega es requerido'),
    receptionResponsibleId: z.number()
        .min(1, 'El responsable de recepción es requerido'),
    observations: z.string()
        .min(1, 'Las observaciones son requeridas')
        .max(500, 'Las observaciones no pueden tener más de 500 caracteres'),
    accounted: z.boolean()
});

export type CertificateFormValues = z.infer<typeof certificateSchema>; 
import { z } from "zod";

export const loanDetailSchema = z.object({
    itemCode: z.string().min(1, "El código del bien es requerido"),
    exitConditionId: z.number().min(1, "La condición de salida es requerida"),
    exitObservations: z.string(),
    quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
});

export const requestorInfoSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Correo electrónico inválido").optional(),
    phone: z.string().optional(),
    role: z.string().optional()
});

export const loanCreateSchema = z.object({
    requestorId: z.string().min(1, "La cédula es requerida"),
    scheduledReturnDate: z.string().min(1, "La fecha de devolución es requerida"),
    reason: z.string().min(1, "El motivo del préstamo es requerido"),
    notes: z.string().optional(),
    loanDetails: z.array(z.object({
        itemCode: z.string().min(1, "El código del item es requerido"),
        exitConditionId: z.number().min(1, "La condición de salida es requerida"),
        exitObservations: z.string().optional(),
        quantity: z.number().min(1, "La cantidad debe ser mayor a 0"),
    })).min(1, "Debe agregar al menos un item"),
    blockBlackListed: z.boolean(),
    requestorInfo: z.object({
        firstName: z.string().min(1, "El nombre es requerido"),
        lastName: z.string().min(1, "El apellido es requerido"),
        email: z.string().email("Correo electrónico inválido").min(1, "El correo electrónico es requerido"),
        phone: z.string().min(1, "El número de teléfono es requerido"),
        role: z.string().min(1, "El rol es requerido")
    })
});

export const returnedItemSchema = z.object({
    loanDetailId: z.number(),
    returnConditionId: z.number(),
    returnObservations: z.string(),
});

export const loanReturnSchema = z.object({
    actualReturnDate: z.date(),
    returnedItems: z.array(z.object({
        loanDetailId: z.string(),
        returnConditionId: z.number(),
        returnObservations: z.string()
    })),
    notes: z.string().optional()
});

export type LoanCreateFormValues = z.infer<typeof loanCreateSchema>;
export type LoanReturnFormValues = z.infer<typeof loanReturnSchema>; 
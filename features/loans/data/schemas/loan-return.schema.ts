import { z } from "zod";

export const returnedItemSchema = z.object({
    loanDetailId: z.number(),
    returnConditionId: z.number().min(1, "Debe seleccionar una condición de retorno"),
    returnObservations: z.string().optional(),
    quantity: z.number().min(1, "La cantidad es requerida")
});

export const loanReturnSchema = z.object({
    loanId: z.number(),
    actualReturnDate: z.string().datetime(),
    returnedItems: z.array(returnedItemSchema).min(1, "Debe devolver al menos un ítem"),
    notes: z.string().optional()
});

export type LoanReturnFormValues = z.infer<typeof loanReturnSchema>; 
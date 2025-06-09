import { z } from "zod";

/**
 * Enum que define los posibles estados de un préstamo en el sistema
 * @enum {string}
 */
export enum LoanStatus {
    /** Estado inicial cuando se solicita un préstamo */
    PENDING = "PENDING",
    /** Estado cuando el préstamo ha sido autorizado */
    APPROVED = "APPROVED",
    /** Estado cuando el préstamo no fue autorizado */
    REJECTED = "REJECTED",
    /** Estado cuando el bien/material ha sido entregado al solicitante */
    DELIVERED = "DELIVERED",
    /** Estado cuando el bien/material ha sido devuelto */
    RETURNED = "RETURNED",
    /** Estado cuando el préstamo ha pasado su fecha de devolución */
    OVERDUE = "OVERDUE",
    /** Estado cuando el préstamo ha sido cancelado */
    CANCELLED = "CANCELLED"
}
export const loanSchema = z.object({
    id: z.number(),
    loanCode: z.string(),
    requestDate: z.string(),
    approvalDate: z.string().nullable(),
    deliveryDate: z.string().nullable(),
    scheduledReturnDate: z.string(),
    actualReturnDate: z.string().nullable(),
    status: z.nativeEnum(LoanStatus),
    requestorId: z.number(),
    approverId: z.number().nullable(),
    reason: z.string(),
    associatedEvent: z.string().nullable(),
    externalLocation: z.string().nullable(),
    notes: z.string().nullable(),
    responsibilityDocument: z.string().nullable(),
    reminderSent: z.boolean(),
    loanDetails: z.array(z.string())
});
export type Loan = z.infer<typeof loanSchema>;
export const loanListResponseSchema = z.object({
    success: z.boolean(),
    message: z.object({
        content: z.array(z.string()),
        displayable: z.boolean()
    }),
    data: z.object({
        total: z.number(),
        limit: z.number(),
        page: z.number(),
        pages: z.number(),
        records: z.array(loanSchema)
    })
});
export type LoanListResponse = z.infer<typeof loanListResponseSchema>;
export const loanResponseSchema = z.object({
    success: z.boolean(),
    message: z.object({
        content: z.array(z.string()),
        displayable: z.boolean()
    }),
    data: loanSchema
});
export type LoanResponse = z.infer<typeof loanResponseSchema>; 
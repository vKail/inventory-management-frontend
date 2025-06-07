import { z } from "zod";

export enum LoanStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    DELIVERED = "DELIVERED",
    RETURNED = "RETURNED",
    OVERDUE = "OVERDUE",
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
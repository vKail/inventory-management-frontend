import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { calculateLoanDateLimits, getDateValidationMessage, getDefaultReturnDate } from '../data/utils/date-utils';

export interface RequestorInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    type: string;
}

export const createLoanFormSchema = (userType: string, allowLongLoan: boolean) => {
    const { minDate, maxDate } = calculateLoanDateLimits(userType, allowLongLoan);
    const dateMessage = getDateValidationMessage(userType, allowLongLoan);

    return z.object({
        requestorId: z.string().min(1, "La cédula es requerida"),
        scheduledReturnDate: z.date({
            required_error: "La fecha de devolución es requerida",
        }).refine(
            (date) => date >= minDate && date <= maxDate,
            { message: dateMessage }
        ),
        reason: z.string().min(1, "El motivo es requerido").max(250, "El motivo no puede exceder 250 caracteres"),
        notes: z.string().max(250, "Las notas no pueden exceder 250 caracteres").optional(),
        requestorInfo: z.object({
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
            phone: z.string().optional(),
            type: z.string().optional()
        }),
        blockBlackListed: z.boolean(),
        loanDetails: z.array(z.object({
            itemId: z.number(),
            exitConditionId: z.number(),
            exitObservations: z.string().max(250, "Las observaciones no pueden exceder 250 caracteres").optional(),
            quantity: z.number().min(1, "La cantidad debe ser mayor a 0")
        })).min(1, "Debe agregar al menos un item")
    });
};

export type LoanFormValues = z.infer<ReturnType<typeof createLoanFormSchema>>;

export const useLoanForm = (userType: string, allowLongLoan: boolean) => {
    const formSchema = createLoanFormSchema(userType, allowLongLoan);

    const form = useForm<LoanFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            requestorId: "",
            scheduledReturnDate: getDefaultReturnDate(userType),
            reason: "",
            notes: "",
            requestorInfo: {
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                type: ""
            },
            blockBlackListed: true,
            loanDetails: []
        }
    });

    return { form, formSchema };
};

import { z } from 'zod'

export const userSchema = z.object({
    userName: z.string().min(1, 'Username is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    career: z.string().min(1, 'Career is required'),
    userType: z.enum(['STUDENT', 'TEACHER', 'ADMINISTRATOR', 'MANAGER']),
    person: z.object({
        dni: z.string().min(1, 'DNI is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email'),
    }),
})


export type UserFormValues = z.infer<typeof userSchema>

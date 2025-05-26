import { z } from 'zod';
import { UserRole } from '../enums/user-roles.enums';

export const userSchema = z.object({
    userName: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    career: z.string(),
    userType: z.nativeEnum(UserRole),
    person: z.object({
        dni: z.string().min(10, 'El DNI debe tener 10 dígitos'),
        firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
        lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
        email: z.string().email('Correo electrónico inválido'),
    }),
});

export type UserFormValues = z.infer<typeof userSchema>; 
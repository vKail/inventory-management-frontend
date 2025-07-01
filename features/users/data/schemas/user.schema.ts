import { z } from 'zod';

export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  MANAGER = 'MANAGER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

const nameRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_\/.\-,]+$/;

export const userSchema = z.object({
  userName: z.string()
    .min(2, 'El nombre de usuario es requerido')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .refine((value) => nameRegex.test(value), 'El usuario solo puede contener letras, números, espacios y los caracteres _ / - , .'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  career: z.string().optional(),
  userType: z.enum([
    UserRole.ADMINISTRATOR,
    UserRole.STUDENT,
    UserRole.TEACHER,
    UserRole.MANAGER
  ], {
    required_error: 'El tipo de usuario es requerido'
  }),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE]),
  person: z.object({
    dni: z.string().length(10, 'El DNI debe tener 10 dígitos'),
    firstName: z.string().min(1, { message: 'El nombre es requerido' }).max(30, { message: 'Máximo 30 caracteres' }),
    lastName: z.string().min(1, { message: 'El apellido es requerido' }).max(30, { message: 'Máximo 30 caracteres' }),
    email: z.string().email('Debe ser un email válido'),
    phone: z.string().optional().or(z.literal('')).refine(
      (val) => !val || val.length === 10,
      { message: 'El teléfono debe tener 10 dígitos' }
    ),
  })
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

import { z } from 'zod';

export enum UserRole {
  ADMINISTRATOR = 'Administrador',
  STUDENT = 'Estudiante',
  TEACHER = 'Docente',
  MANAGER = 'Gerente'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export const userSchema = z.object({
  userName: z.string().min(2, 'El nombre de usuario es requerido'),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional(),
  career: z.string().nullable(),
  userType: z.enum([
    UserRole.ADMINISTRATOR,
    UserRole.STUDENT,
    UserRole.TEACHER,
    UserRole.MANAGER
  ], {
    required_error: 'El tipo de usuario es requerido'
  }),
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE])
    .optional()
    .default(UserStatus.ACTIVE),
  person: z.object({
    dni: z.string().min(10, 'El DNI debe tener 10 dígitos'),
    firstName: z.string().min(2, 'El nombre es requerido'),
    middleName: z.string().optional(),
    lastName: z.string().min(2, 'El apellido es requerido'),
    secondLastName: z.string().optional(),
    email: z.string().email('Email inválido'),
    birthDate: z.string().optional(),
    phone: z.string().optional()
  })
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

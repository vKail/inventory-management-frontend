import { z } from 'zod';

export const createUserSchema = z.object({
  userName: z.string().min(2, 'El nombre de usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  career: z.string().nullable(),
  userType: z.string(),
  status: z.string().optional().default('ACTIVE'),
  person: z.object({
    dni: z.string(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    secondLastName: z.string().optional(),
    email: z.string().email('Email inválido'),
    birthDate: z.string().optional(),
    phone: z.string().optional()
  }),
  // Campos adicionales para el formulario pero que no se envían a la API
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.string()
});

export const updateUserSchema = z.object({
  userName: z.string().min(2, 'El nombre de usuario es requerido'),
  password: z.string().optional(),
  career: z.string().nullable(),
  userType: z.string(),
  status: z.string().optional().default('ACTIVE'),
  person: z.object({
    dni: z.string(),
    firstName: z.string(),
    middleName: z.string().optional(),
    lastName: z.string(),
    secondLastName: z.string().optional(),
    email: z.string().email('Email inválido'),
    birthDate: z.string().optional(),
    phone: z.string().optional()
  }),
  // Campos adicionales para el formulario pero que no se envían a la API
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  role: z.string()
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

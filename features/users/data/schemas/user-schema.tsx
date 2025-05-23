import { z } from 'zod';

export const userSchema = z.object({
  userName: z.string().min(1, 'Usuario requerido'),
  career: z.string().min(1, 'Carrera requerida'),
  person: z.object({
    firstName: z.string().min(1, 'Nombre requerido'),
    lastName: z.string().min(1, 'Apellido requerido'),
    email: z.string().email('Correo inválido'),
  }),
});

export type UserFormValues = z.infer<typeof userSchema>;

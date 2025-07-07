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

const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;

// Ecuadorian DNI (cedula) validation function
function isValidEcuadorianDNI(dni: string): boolean {
  if (!/^[0-9]{10}$/.test(dni)) return false;
  const province = parseInt(dni.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;
  const thirdDigit = parseInt(dni[2], 10);
  if (thirdDigit > 6) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(dni[i], 10);
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const verifier = parseInt(dni[9], 10);
  const computed = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return verifier === computed;
}

export const userSchema = z.object({
  userName: z.string()
    .min(2, 'El nombre de usuario es requerido')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .refine((value) => nameRegex.test(value), 'El usuario solo puede contener letras, números, espacios y los caracteres _ / - , .'),
  password: z.string().optional(),
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
    dni: z.string()
      .length(10, 'El DNI debe tener 10 dígitos')
      .refine(isValidEcuadorianDNI, {
        message: 'El DNI no es válido para Ecuador',
      }),
    firstName: z.string().min(1, { message: 'El nombre es requerido' }).max(30, { message: 'Máximo 30 caracteres' }),
    lastName: z.string().min(1, { message: 'El apellido es requerido' }).max(30, { message: 'Máximo 30 caracteres' }),
    email: z.string().email('Debe ser un email válido'),
    phone: z.string().optional().or(z.literal('')).refine(
      (val) => !val || val.length === 10,
      { message: 'El teléfono debe tener 10 dígitos' }
    ),
  })
}).superRefine((data, ctx) => {
  // Only require password if it is present (i.e., on create)
  if (typeof data.password !== 'undefined') {
    if (!data.password || data.password.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    } else if (!passwordRegex.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'La contraseña debe contener al menos un carácter especial',
      });
    }
  }
});

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

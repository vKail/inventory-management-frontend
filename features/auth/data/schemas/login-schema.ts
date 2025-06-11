import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres",
  }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
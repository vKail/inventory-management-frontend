import { z } from "zod";
import { RegisterFormData } from "../interfaces/register.interface";

export const registerSchema = z.object({
  codigoBien: z.string().min(3, "Mínimo 3 caracteres"),
  nombreBien: z.string().min(3, "Mínimo 3 caracteres"),
  colorBien: z.string().min(2, "Mínimo 2 caracteres"),
  codigoAnterior: z.string().optional(),
  serieIdentificacion: z.string().min(3, "Mínimo 3 caracteres"),
  materialPrincipal: z.string().min(3, "Mínimo 3 caracteres"),
  identificadorUnico: z.string().min(3, "Mínimo 3 caracteres"),
  modeloCaracteristicas: z.string().min(3, "Mínimo 3 caracteres"),
  dimensiones: z.string().min(3, "Mínimo 3 caracteres"),
  numeroActaMatriz: z.string().min(3, "Mínimo 3 caracteres"),
  marcaOtrosDatos: z.string().min(3, "Mínimo 3 caracteres"),
  fechaIngreso: z.date({
    required_error: "La fecha de ingreso es requerida",
    invalid_type_error: "Formato de fecha inválido",
  }),
  nombreCustodio: z.string().min(3, "Mínimo 3 caracteres"),
  numeroItemRegion: z.string().min(1, "Requerido"),
  codigoCuentaContable: z.string().min(3, "Mínimo 3 caracteres"),
  valorContable: z.number().min(0, "Valor no puede ser negativo"),
  ubicacionFisica: z.string().min(3, "Mínimo 3 caracteres"),
  oficinaLaboratorio: z.string().min(3, "Mínimo 3 caracteres"),
});

export type RegisterFormSchema = z.infer<typeof registerSchema>;
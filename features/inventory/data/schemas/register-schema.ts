import { z } from "zod";

export const registerSchema = z.object({
  // === Sección 1: Identificación y Códigos ===
  codigoBien: z.string().min(3, "Mínimo 3 caracteres"),
  codigoAnterior: z.string().optional(),
  identificador: z.string().min(3, "Mínimo 3 caracteres"),
  nroActaMatriz: z.string().min(3, "Mínimo 3 caracteres"),
  bldBca: z.enum(["BLD", "BCA"], {
    required_error: "Debe seleccionar BLD o BCA",
    invalid_type_error: "Valor inválido",
  }),

  // === Sección 2: Características del Bien ===
  bien: z.string().min(3, "Mínimo 3 caracteres"),
  serieIdentificacion: z.string().min(3, "Mínimo 3 caracteres"),
  modeloCaracteristicas: z.string().min(3, "Mínimo 3 caracteres"),
  marcaRazaOtros: z.string().min(3, "Mínimo 3 caracteres"),
  color: z.string().min(2, "Seleccione un color válido"),
  material: z.string().min(2, "Seleccione un material válido"),
  dimensiones: z.string().min(3, "Mínimo 3 caracteres"),

  // === Sección 3: Ubicación y Responsable ===
  custodioActual: z.string().min(3, "Mínimo 3 caracteres"),
  ubicacion: z.string().min(3, "Seleccione una ubicación válida"),
  oficinaLaboratorio: z.string().min(3, "Seleccione una oficina válida"),

  // === Sección 4: Información Contable ===
  itemRenglon: z.string().min(1, "Requerido"),
  cuentaContable: z.string().min(3, "Mínimo 3 caracteres"),
  fechaIngreso: z.date({
    required_error: "La fecha de ingreso es requerida",
    invalid_type_error: "Formato de fecha inválido",
  }),
  valorContable: z.number().min(0, "El valor no puede ser negativo"),
});

export type RegisterFormSchema = z.infer<typeof registerSchema>;
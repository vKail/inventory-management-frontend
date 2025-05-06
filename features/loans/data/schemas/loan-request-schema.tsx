import { z } from "zod";

export const loanRequestSchema = z.object({
  nombres: z.string().min(1, "Nombres son requeridos"),
  apellidos: z.string().min(1, "Apellidos son requeridos"),
  correo: z.string().email("Correo inválido"),
  telefono: z.string().min(1, "Teléfono requerido"),
  rol: z.string().min(1, "Rol requerido"),
  cedula: z.string().min(1, "Cédula requerida"),
  bienId: z.string().min(1, "Debe seleccionar un bien"),
  bienNombre: z.string().optional(),
  motivo: z.string().min(1, "Motivo requerido"),
  eventoAsociado: z.string().optional(),
  ubicacionExterna: z.string().optional(),
  fechaDevolucion: z.date().nullable(),
  notas: z.string().optional(),
  aceptaResponsabilidad: z.boolean().refine(val => val === true, {
    message: "Debe aceptar la responsabilidad",
  }),
});

export type LoanRequestFormValues = z.infer<typeof loanRequestSchema>;

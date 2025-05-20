import * as z from "zod";

export const materialSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().min(1, "Descripción requerida"),
  materialType: z.string().min(1, "Tipo requerido"),
});

export type MaterialFormValues = z.infer<typeof materialSchema>;
import * as z from "zod"

export const colorSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  hexCode: z.string().min(1, "Código hexadecimal requerido").max(7, "El código hexadecimal debe tener 7 caracteres"),
  description: z.string().min(1, "Descripción requerida").max(500, "La descripción no puede exceder 500 caracteres"),
})
export type ColorFormValues = z.infer<typeof colorSchema> 
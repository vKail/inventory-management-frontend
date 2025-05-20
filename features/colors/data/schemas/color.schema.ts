import * as z from "zod"

export const colorSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
    hexCode: z.string().min(1, "Código hexadecimal requerido"),
    description: z.string().min(1, "Descripción requerida"),
})
export type ColorFormValues = z.infer<typeof colorSchema> 
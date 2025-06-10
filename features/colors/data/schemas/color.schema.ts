import * as z from "zod"

// This schema defines the structure of a color object
// It uses Zod for validation, ensuring that the color object has a name, hexCode, and description,
// all of which are required and must be non-empty strings.
export const colorSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
    hexCode: z.string().min(1, "Código hexadecimal requerido"),
    description: z.string().min(1, "Descripción requerida"),
})

// This type is derived from the colorSchema using Zod's infer utility
// It represents the expected structure of a color object in the application.
export type ColorFormValues = z.infer<typeof colorSchema> 
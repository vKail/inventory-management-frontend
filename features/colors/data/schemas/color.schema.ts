import * as z from "zod"

export const colorSchema = z.object({
  name: z.string()
    .min(1, "Nombre requerido")
    .max(25, "El nombre no puede exceder 25 caracteres")
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      return textRegex.test(value.trim());
    }, "El nombre debe contener solo letras y espacios"),
  hexCode: z.string()
    .min(1, "Código hexadecimal requerido")
    .max(7, "El código hexadecimal debe tener 7 caracteres")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Debe ser un código hexadecimal válido (ej: #FF0000)"),
  description: z.string()
    .min(1, "Descripción requerida")
    .max(250, "La descripción no puede exceder 250 caracteres")
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      // Permite letras, números, espacios y signos de puntuación básicos para descripciones
      const descriptionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?()\-_]+$/;
      return descriptionRegex.test(value.trim());
    }, "La descripción debe contener solo letras, números, espacios y signos de puntuación válidos"),
})
export type ColorFormValues = z.infer<typeof colorSchema> 
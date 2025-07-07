// data/schemas/category.schema.ts
import { z } from "zod";

export const categorySchema = z.object({
  code: z.string()
    .min(1, "El código es requerido")
    .max(10, "El código no puede exceder 10 caracteres")
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      // Solo permite letras, números y espacios
      const codeRegex = /^[a-zA-Z0-9\s]+$/;
      return codeRegex.test(value.trim());
    }, "El código debe contener solo letras, números y espacios"),
  name: z.string()
    .min(1, "El nombre es requerido")
    .max(25, "El nombre no puede exceder 25 caracteres")
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:!()/-]+$/;
      return textRegex.test(value.trim());
    }, "El nombre debe contener solo letras, espacios y caracteres válidos"),
  description: z.string()
    .min(1, "La descripción es requerida")
    .max(250, "La descripción no puede exceder 250 caracteres")
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      // Permite letras, números, espacios y signos de puntuación básicos para descripciones
      const descriptionRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?()\-_]+$/;
      return descriptionRegex.test(value.trim());
    }, "La descripción debe contener solo letras, números, espacios y signos de puntuación válidos"),
  parentCategoryId: z.union([z.number(), z.null()]).optional(),
  standardUsefulLife: z.number().min(0, "La vida útil debe ser mayor o igual a 0").max(50, "La vida útil no puede exceder 50 años"),
  depreciationPercentage: z.string().refine(
    (val) => {
      // Normalize the input: replace comma with dot and trim whitespace
      const normalizedVal = val.replace(',', '.').trim();
      const num = parseFloat(normalizedVal);

      // Check if it's a valid number between 0 and 1
      if (isNaN(num) || num < 0 || num > 1) {
        return false;
      }

      // Check if it has more than 2 decimal places
      const decimalPlaces = normalizedVal.split('.')[1]?.length || 0;
      return decimalPlaces <= 2;
    },
    {
      message: "El porcentaje de depreciación debe ser un número entre 0 y 1 con máximo 2 decimales (ej: 0.15 o 0,25)",
    }
  ).transform((val) => {
    // Transform the value to always use dot as decimal separator for backend
    return val.replace(',', '.');
  }),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
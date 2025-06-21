// data/schemas/category.schema.ts
import { z } from "zod";

export const categorySchema = z.object({
  code: z.string().min(1, "El código es requerido").max(50, "El código no puede exceder 50 caracteres"),
  name: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  description: z.string().min(1, "La descripción es requerida").max(500, "La descripción no puede exceder 500 caracteres"),
  parentCategoryId: z.union([z.number(), z.null()]).optional(),
  standardUsefulLife: z.number().min(0, "La vida útil debe ser mayor o igual a 0"),
  depreciationPercentage: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    },
    {
      message: "El porcentaje de depreciación debe ser un número entre 0 y 100",
    }
  ),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
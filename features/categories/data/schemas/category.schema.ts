// data/schemas/category.schema.ts
import * as z from "zod";

export const categorySchema = z.object({
  code: z.string().min(1, "Código requerido"),
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().min(1, "Descripción requerida"),
  parentCategoryId: z.number().nullable(),
  standardUsefulLife: z.number().min(1, "Vida útil requerida"),
  depreciationPercentage: z.string().regex(/^\d+(\.\d{1,2})?$/, "Porcentaje inválido"),
  active: z.boolean()
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
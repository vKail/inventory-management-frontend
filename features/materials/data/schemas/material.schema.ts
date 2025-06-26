import { z } from 'zod';

export enum MaterialTypes {
  CONSUMABLE = "CONSUMABLE",
  TOOL = "TOOL",
  EQUIPMENT = "EQUIPMENT",
  METAL = "METAL",
  OTHER = "OTHER",
  DELICATE = "DELICATE"
}

export const materialSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(25, 'El nombre no puede exceder 25 caracteres')
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?()/-]+$/;
      return textRegex.test(value.trim());
    }, 'El nombre debe contener solo letras, espacios y caracteres válidos'),
  description: z.string()
    .min(1, 'La descripción es requerida')
    .max(250, 'La descripción no puede exceder 250 caracteres')
    .refine((value) => {
      if (!value || value.trim() === "") return false;
      const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?()-]+$/;
      return textRegex.test(value.trim());
    }, 'La descripción debe contener solo letras y espacios válidos'),
  materialType: z.nativeEnum(MaterialTypes, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de material válido' })
  })
});

export type MaterialFormValues = z.infer<typeof materialSchema>;
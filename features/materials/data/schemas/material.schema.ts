import { z } from 'zod';
import { MaterialTypes } from '../interfaces/material.interface';

export const materialSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  description: z.string()
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  materialType: z.enum([
    MaterialTypes.CONSUMABLE,
    MaterialTypes.TOOL,
    MaterialTypes.EQUIPMENT,
    MaterialTypes.METAL,
    MaterialTypes.OTHER,
    MaterialTypes.DELICATE
  ], {
    required_error: 'El tipo de material es requerido',
    invalid_type_error: 'Tipo de material inválido'
  })
});

export type MaterialFormValues = z.infer<typeof materialSchema>;
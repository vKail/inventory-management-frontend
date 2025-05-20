import { z } from 'zod'

export const itemTypeSchema = z.object({
  code: z.string().min(1, 'Código requerido'),
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().min(1, 'Descripción requerida'),
  active: z.boolean().default(true).optional(),
})

export type ItemTypeFormValues = z.infer<typeof itemTypeSchema>

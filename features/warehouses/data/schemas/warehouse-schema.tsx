import { z } from 'zod'

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  location: z.string().min(1, 'Ubicación requerida'),
  responsibleId: z.number(),
  description: z.string().min(1, 'Descripción requerida'),
  active: z.boolean().default(true).optional(),
})

export type WarehouseFormValues = z.infer<typeof warehouseSchema>

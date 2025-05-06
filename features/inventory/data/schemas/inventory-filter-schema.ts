import * as z from 'zod';

export const inventoryFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  department: z.string().optional(),
  state: z.string().optional(),
});

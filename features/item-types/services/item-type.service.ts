import { ApiResponse, ItemType, PaginatedItemTypes } from '../data/interfaces/item-type.interface'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}item-types`

export async function fetchItemTypes(): Promise<PaginatedItemTypes> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Error fetching item types')
  const json: ApiResponse<PaginatedItemTypes> = await res.json()
  return json.data
}

export async function fetchItemTypeById(id: string): Promise<ItemType> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Error fetching item type')
  const json: ApiResponse<ItemType> = await res.json()
  return json.data
}

export async function createItemType(data: Omit<ItemType, 'id' | 'active'>): Promise<ItemType> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error creating item type')
  const json: ApiResponse<ItemType> = await res.json()
  return json.data
}

export async function updateItemType(id: string, data: Partial<Omit<ItemType, 'id' | 'active'>>): Promise<ItemType> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error updating item type')
  const json: ApiResponse<ItemType> = await res.json()
  return json.data
}

export async function deleteItemType(id: string): Promise<ItemType> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error deleting item type')
  const json: ApiResponse<ItemType> = await res.json()
  return json.data
}

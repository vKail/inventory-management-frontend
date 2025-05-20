import { ApiResponse, PaginatedWarehouses, Warehouse } from '../data/interfaces/warehouse.interface'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}warehouses`


export async function fetchWarehouses(page = 1, limit = 10): Promise<PaginatedWarehouses> {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`)
  if (!res.ok) throw new Error('Error fetching warehouses')
  const json: ApiResponse<PaginatedWarehouses> = await res.json()
  return json.data
}

export async function fetchWarehouseById(id: string): Promise<Warehouse> {
  const res = await fetch(`${BASE_URL}/${id}`)
  if (!res.ok) throw new Error('Error fetching warehouse')
  const json: ApiResponse<Warehouse> = await res.json()
  return json.data
}

export async function createWarehouse(data: Omit<Warehouse, 'id' | 'active'>): Promise<Warehouse> {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error creating warehouse')
  const json: ApiResponse<Warehouse> = await res.json()
  return json.data
}

export async function updateWarehouse(id: string,data: Partial<Omit<Warehouse, 'id' | 'active'>>): Promise<Warehouse> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error updating warehouse')
  const json: ApiResponse<Warehouse> = await res.json()
  return json.data
}

export async function deleteWarehouse(id: string): Promise<Warehouse> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error deleting warehouse')
  const json: ApiResponse<Warehouse> = await res.json()
  return json.data
}

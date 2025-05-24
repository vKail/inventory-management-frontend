import { User, PaginatedUsers, ApiResponse } from '../data/interfaces/user.interface'

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}users`

function getHeaders() {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

export async function fetchUsers(page = 1, limit = 10): Promise<PaginatedUsers> {
  const res = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Error fetching users')
  const json: ApiResponse<PaginatedUsers> = await res.json()
  return json.data
}

export async function fetchUserById(id: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error('Error fetching user')
  const json: ApiResponse<User> = await res.json()
  return json.data
}

export async function createUser(data: Partial<User>): Promise<User> {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error creating user')
  const json: ApiResponse<User> = await res.json()
  return json.data
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error updating user')
  const json: ApiResponse<User> = await res.json()
  return json.data
}
export async function changeUserStatus(id: string, status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
  const res = await fetch(`${BASE_URL}/change-status/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Error changing user status')
}

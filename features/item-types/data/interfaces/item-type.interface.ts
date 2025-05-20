export interface ItemType {
  id: string
  code: string
  name: string
  description: string
  active: boolean
}

export interface ApiResponse<T> {
  success: boolean
  message: { content: string[]; displayable: boolean }
  data: T
}

export interface PaginatedItemTypes {
  total: number
  limit: number
  page: number
  pages: number
  records: ItemType[]
}

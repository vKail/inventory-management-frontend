import { Location, CreateLocation } from '../interfaces/location.interface'
import { AxiosClient } from '@/core/infrestucture/AxiosClient'
import { API_ROUTES } from '@/core/data/constants/api-routes'
import { HttpHandler } from '@/core/data/interfaces/HttpHandler'

const httpClient: HttpHandler = AxiosClient.getInstance()

export const locationService = {
  async getAll(limit = 8, page = 1): Promise<Location[]> {
    const response = await httpClient.get<{ records: Location[] }>(
      `${API_ROUTES.LOCATIONS.BASE}?limit=${limit}&page=${page}`
    )
    return response.data.records
  },

  async getById(id: number): Promise<Location> {
    const response = await httpClient.get<Location>(API_ROUTES.LOCATIONS.BY_ID(id))
    return response.data
  },

  async create(data: CreateLocation): Promise<Location> {
    const response = await httpClient.post<Location>(API_ROUTES.LOCATIONS.BASE, data)
    return response.data
  },

  async update(id: number, data: CreateLocation): Promise<Location> {
    const response = await httpClient.patch<Location>(API_ROUTES.LOCATIONS.BY_ID(id), data)
    return response.data
  },

  async delete(id: number): Promise<boolean> {
    await httpClient.delete(API_ROUTES.LOCATIONS.BY_ID(id))
    return true
  },
}

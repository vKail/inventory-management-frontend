import { useRouter } from 'next/navigation'
import { CreateLocation } from '../interfaces/location.interface'
import { locationService } from '../services/location-service'

export function useLocationEditForm(id: number) {
  const router = useRouter()

  const onSubmit = async (values: CreateLocation) => {
    try {
      const cleanedPayload: Partial<CreateLocation> = {}

      Object.entries(values).forEach(([key, value]) => {
        if (
          value !== null &&
          value !== undefined &&
          value !== '' &&
          !(typeof value === 'number' && isNaN(value))
        ) {
          const trimmedValue =
            typeof value === 'string' ? value.trim() : value

          // @ts-expect-error: Indexación dinámica segura
          cleanedPayload[key] = trimmedValue
        }
      })

      cleanedPayload.parentLocationId =
        values.parentLocationId === 0 || values.parentLocationId === null
          ? null
          : Number(values.parentLocationId)

      cleanedPayload.warehouseId = Number(values.warehouseId)

      if (values.capacity !== undefined) {
        cleanedPayload.capacity = values.capacity === null ? null : Number(values.capacity)
      }

      if (values.occupancy !== undefined) {
        cleanedPayload.occupancy = values.occupancy === null ? null : Number(values.occupancy)
      }

      if (typeof values.active === 'boolean') {
        cleanedPayload.active = values.active
      }

      await locationService.update(id, cleanedPayload as CreateLocation)
      router.push('/locations')
    } catch (error) {
      console.error('Error al actualizar ubicación:', error)
    }
  }

  return { onSubmit }
}

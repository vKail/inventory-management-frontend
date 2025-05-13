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
      cleanedPayload.capacity = Number(values.capacity)
      cleanedPayload.occupancy = Number(values.occupancy)
      cleanedPayload.active = Boolean(values.active)

      await locationService.update(id, cleanedPayload as CreateLocation)
      router.push('/locations')
    } catch (error) {
      console.error('Error al actualizar ubicación:', error)
    }
  }

  return { onSubmit }
}

import { useRouter } from 'next/navigation'
import { CreateLocation } from '../interfaces/location.interface'

export function useLocationForm() {
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


      cleanedPayload.parentLocationId = 2 

      cleanedPayload.warehouseId = Number(values.warehouseId)

      cleanedPayload.capacity =
        values.capacity !== undefined && values.capacity !== null
          ? Number(values.capacity)
          : null

      cleanedPayload.occupancy =
        values.occupancy !== undefined && values.occupancy !== null
          ? Number(values.occupancy)
          : null

      cleanedPayload.active = Boolean(values.active)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedPayload),
      })

      if (!response.ok) {
        const errorMessage = await response.text()
        console.error('Error del servidor:', errorMessage)
        throw new Error('Error al crear la ubicación')
      }

      router.push('/locations')
    } catch (error) {
      console.error('Error en el envío:', error)
    }
  }

  return { onSubmit }
}

import { useEffect, useMemo, useState } from 'react'
import { Location } from '../interfaces/location.interface'
import { locationService } from '../services/location-service'

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const fetchLocations = async () => {
    try {
      setLoading(true)
      const data = await locationService.getAll(pageSize, page)
      setLocations(data)
    } finally {
      setLoading(false)
    }
  }

  const deleteLocation = async (id: number) => {
    try {
      await locationService.delete(id)
      await fetchLocations()
    } catch (error) {
      console.error('Error al eliminar ubicación:', error)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [page])

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => {
    const normalizedSearch = search.toLowerCase()
    return locations.filter((l) =>
      !search ||
      l.name.toLowerCase().includes(normalizedSearch) ||
      l.type.toLowerCase().includes(normalizedSearch) ||
      l.building?.toLowerCase().includes(normalizedSearch) ||
      l.floor?.toLowerCase().includes(normalizedSearch)
    )
  }, [locations, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  return {
    locations: filtered,
    totalPages,
    loading,
    search,
    setSearch,
    page,
    setPage,
    refresh: fetchLocations,
    deleteLocation,
  }
}

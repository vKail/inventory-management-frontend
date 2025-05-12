import { useEffect, useMemo, useState } from 'react'
import { Location } from '../interfaces/location.interface'
import { mockLocations } from '../data/mock-locations'

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    setLoading(true)
    setLocations(mockLocations)
    setLoading(false)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => {
    return locations.filter(
      (l) =>
        !search ||
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.type.toLowerCase().includes(search.toLowerCase()) ||
        l.building.toLowerCase().includes(search.toLowerCase()) ||
        l.floor.toLowerCase().includes(search.toLowerCase())
    )
  }, [locations, search])

  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize)
  }, [filtered, page])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  return {
    locations: paginated,
    totalPages,
    loading,
    search,
    setSearch,
    page,
    setPage,
  }
}

'use client'

import { Pencil, Trash2, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Location } from '../types/location'

interface LocationTableProps {
  locations: Location[]
  loading: boolean
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export default function LocationTable({
  locations,
  loading,
  onEdit,
  onDelete,
}: LocationTableProps) {
  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-12">
              Loading...
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  if (locations.length === 0) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-20 text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <MapPin className="h-10 w-10 opacity-30" />
                <span>No locations found</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Building</TableHead>
          <TableHead>Floor</TableHead>
          <TableHead>Capacity</TableHead>
          <TableHead>Occupancy</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {locations.map((location) => (
          <TableRow key={location.id}>
            <TableCell>{location.name}</TableCell>
            <TableCell>{location.type}</TableCell>
            <TableCell>{location.building}</TableCell>
            <TableCell>{location.floor}</TableCell>
            <TableCell>{`${location.capacity} ${location.capacityUnit}`}</TableCell>
            <TableCell>{`${location.occupancy} ${location.capacityUnit}`}</TableCell>
            <TableCell>
              <Badge variant={location.active ? 'default' : 'secondary'}>
                {location.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(location.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(location.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

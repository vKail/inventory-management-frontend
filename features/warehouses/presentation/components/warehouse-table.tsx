// features/warehouses/presentation/components/warehouse-table.tsx
'use client'

import { Warehouse } from '../../data/interfaces/warehouse.interface'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  warehouses: Warehouse[]
  onDelete: (id: string) => void
}

export default function WarehouseTable({ warehouses, onDelete }: Props) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Responsable</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {warehouses.map((w) => (
          <TableRow key={w.id}>
            <TableCell>{w.name}</TableCell>
            <TableCell>{w.location}</TableCell>
            <TableCell>{w.responsibleId}</TableCell>
            <TableCell>
              <Badge variant={w.active ? 'default' : 'secondary'}>
                {w.active ? 'Activo' : 'Inactivo'}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/dashboard/warehouses/form?id=${w.id}`)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(w.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

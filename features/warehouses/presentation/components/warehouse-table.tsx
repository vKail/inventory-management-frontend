// features/warehouses/presentation/components/warehouse-table.tsx
'use client'

import { IWarehouseResponse } from '../../data/interfaces/warehouse.interface'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { WarehousePagination } from './warehouse-pagination'

interface WarehouseTableProps {
  warehouses: IWarehouseResponse[]
  onDelete: (id: number) => void
  loading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function WarehouseTable({
  warehouses,
  onDelete,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: WarehouseTableProps) {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="rounded-md border min-h-[500px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead className="w-28 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
                    <span className="ml-2">Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  No hay almacenes registrados o que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
                <TableRow key={warehouse.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.address}</TableCell>
                  <TableCell>{warehouse.phone}</TableCell>
                  <TableCell>{warehouse.capacity}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push(`/warehouses/edit/${warehouse.id}`)}
                      >
                        <Pencil className="mr-1 h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(warehouse.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {!loading && warehouses.length > 0 && (
        <div className="mt-4">
          <WarehousePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

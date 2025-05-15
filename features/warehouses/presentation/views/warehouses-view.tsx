'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWarehouses, deleteWarehouse } from '../../services/warehouse.service'
import { Warehouse } from '../../data/interfaces/warehouse.interface'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function WarehousesView() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWarehouses()
        setWarehouses(data.records)
      } catch (error) {
        console.error('Error fetching warehouses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Deseas eliminar este almacén?')) return
    try {
      await deleteWarehouse(id)
      setWarehouses(prev => prev.filter(w => w.id !== id))
    } catch (error) {
      console.error('Error deleting warehouse:', error)
    }
  }

  return (
    <div className="flex flex-col items-center px-6 w-full">
      <div className="w-full max-w-[1200px]">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Almacenes</CardTitle>
            <Button onClick={() => router.push('/warehouses/form')}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Almacén
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Descripcion</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : warehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No hay almacenes registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  warehouses.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>{w.name}</TableCell>
                      <TableCell>{w.location}</TableCell>
                      <TableCell>{w.responsibleId}</TableCell>
                      <TableCell>{w.description}</TableCell>
                      <TableCell>
                        <Badge variant={w.active ? 'default' : 'secondary'}>
                          {w.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/warehouses/form?id=${w.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(w.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
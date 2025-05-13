'use client'

import { useState } from 'react'
import { PlusCircle, MapPin, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useLocations } from '../../hooks/use-locations'
import LocationTable from '../components/location-table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'

export default function LocationsView() {
  const {
    locations,
    loading,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    deleteLocation,
  } = useLocations()

  const router = useRouter()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (id: number) => {
    router.push(`/locations/${id}/edit`)
  }

  const handleDelete = (id: number) => {
    setSelectedId(id)
    setDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedId !== null) {
      await deleteLocation(selectedId)
    }
    setDialogOpen(false)
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col items-center space-y-6 px-6 md:px-12 w-full">
      <div className="mb-2 w-[1200px] min-w-[1200px] max-w-[1200px] mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">Configuración</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <MapPin className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Ubicaciones</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-2xl font-bold tracking-tight">Lista de Ubicaciones</h2>
        <p className="text-muted-foreground">Todas las ubicaciones registradas en el sistema</p>
      </div>
      <Card className="w-[1200px] mx-auto">
        <CardHeader className="px-4 md:px-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto py-2 mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre, tipo, edificio o piso..."
                className="border rounded px-3 py-2 text-sm w-full md:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button onClick={() => router.push('/locations/new')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Ubicación
            </Button>
          </div>
          <hr className="border-t border-muted" />
        </CardHeader>
        <CardContent className="px-4 md:px-8 pb-6">
          <div className="min-h-[400px] flex flex-col justify-between">
            <LocationTable
              locations={locations}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar ubicación?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar esta ubicación del sistema. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Confirmar eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

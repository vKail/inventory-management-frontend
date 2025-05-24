'use client'

import React, { useState, useEffect } from 'react'
import { Record } from '../../data/interfaces/material.interface'
import { Pencil, Trash2, PackagePlus, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface Props {
  materials: Record[]
  onDelete: (id: number) => void
  onEdit: (material: Record) => void
  loading?: boolean
}

export const MaterialTable: React.FC<Props> = ({ materials, onDelete, onEdit, loading = false }) => {
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [page, setPage] = useState(1)
  const pageSize = 8

  // Filtrado según búsqueda y tipo
  const filteredMaterials = materials.filter(material =>
    (!search ||
      material.name.toLowerCase().includes(search.toLowerCase()) ||
      material.description.toLowerCase().includes(search.toLowerCase())
    ) &&
    (typeFilter === 'all' || material.materialType === typeFilter)
  )

  const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / pageSize))
  const paginatedMaterials = filteredMaterials.slice((page - 1) * pageSize, page * pageSize)

  useEffect(() => { setPage(1) }, [search, typeFilter])

  return (
    <div className="flex flex-col items-center space-y-6 px-6 md:px-12 w-full">
      <div className="w-full max-w-[1200px]">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground font-medium">Configuración</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Package className="inline mr-1 h-4 w-4 text-primary align-middle" />
              <BreadcrumbPage>Materiales</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-2xl font-bold tracking-tight">Lista de Materiales</h2>
        <p className="text-muted-foreground">Todos los materiales registrados en el sistema</p>
      </div>

      <Card className="w-full max-w-[1200px]">
        <CardHeader className="px-4 md:px-8 pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                className="border rounded px-3 py-2 text-sm w-full md:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Madera">Madera</SelectItem>
                  <SelectItem value="Plástico">Plástico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => router.push('/materials/new')}>
              <PackagePlus className="mr-2 h-4 w-4" />
              Nuevo Material
            </Button>
          </div>
          <hr className="border-t border-muted" />
        </CardHeader>
        <CardContent className="px-4 md:px-8 pb-6">
          <div className="min-h-[400px] flex flex-col justify-between">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <span className="text-muted-foreground">Cargando...</span>
                    </TableCell>
                  </TableRow>
                ) : paginatedMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-10 w-10 opacity-30" />
                        <span>No hay materiales para mostrar</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{material.materialType}</Badge>
                      </TableCell>
                      <TableCell>{material.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(material)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(material.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

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
    </div>
  )
}

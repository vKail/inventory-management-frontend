'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ItemType } from '../../data/interfaces/item-type.interface'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { itemTypeService } from '../../services/item-type.service'

export default function ItemTypesView() {
  const [itemTypes, setItemTypes] = useState<ItemType[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const data = await itemTypeService.getItemTypes()
        setItemTypes(data.records)
      } catch (error) {
        toast.error('Error cargando tipos de item')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = (id: string) => {
    const toastId = toast('¿Deseas eliminar este tipo de item?', {
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await itemTypeService.deleteItemType(id)
            setItemTypes(prev => prev.filter(i => i.id !== id))
            toast.success('Tipo de item eliminado')
          } catch (err) {
            toast.error('No se pudo eliminar')
          } finally {
            toast.dismiss(toastId)
          }
        },
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => toast.dismiss(toastId),
      },
    })
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-12 w-full">
      <div className="w-full max-w-[1200px]">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Tipos de Items</CardTitle>
            <Button onClick={() => router.push('/item-types/form')}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Cargando...</TableCell>
                  </TableRow>
                ) : itemTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No hay tipos de item registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  itemTypes.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/item-types/form?id=${item.id}`)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
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

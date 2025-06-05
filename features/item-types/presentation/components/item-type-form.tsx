'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { ItemType } from '../../data/interfaces/item-type.interface'
import { itemTypeSchema, type ItemTypeFormValues } from '../../data/schemas/item-type.schema'
import { useItemTypeStore } from '../../context/item-types-store'
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Boxes } from 'lucide-react';
interface ItemTypeFormProps {
  id?: string
}

export default function ItemTypeForm({ id }: ItemTypeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { getItemTypeById, addItemType, updateItemType } = useItemTypeStore()

  const form = useForm<ItemTypeFormValues>({
    resolver: zodResolver(itemTypeSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      active: true,
    },
  })

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const itemType = await getItemTypeById(id)
          if (itemType) {
            form.reset({
              code: itemType.code,
              name: itemType.name,
              description: itemType.description,
              active: itemType.active,
            })
          }
        } catch (err) {
          console.error('Error loading item type:', err)
          toast.error('Error al cargar el tipo de item')
        }
      }
    }
    loadData()
  }, [id, form, getItemTypeById])

  const onSubmit = async (data: ItemTypeFormValues) => {
    setLoading(true)
    try {
      const { active, ...dataToSend } = data

      if (id) {
        await updateItemType(id, dataToSend)
        toast.success('Tipo de item actualizado exitosamente')
      } else {
        await addItemType(dataToSend)
        toast.success('Tipo de item creado exitosamente')
      }
      router.push('/item-types')
    } catch (error) {
      toast.error('Ocurrió un error al guardar el tipo de item')
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      {/* Breadcrumbs, título y descripción */}
      {/* Breadcrumbs, título y descripción */}
      <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Boxes className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/item-types">Tipos de Item</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{id ? "Editar Tipo de Item" : "Nuevo Tipo de Item"}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <h3 className="text-lg font-semibold mb-1">Detalles del tipo de item</h3>
          <p className="text-muted-foreground text-sm">
            Ingresa la información general del tipo de item.
          </p>
        </div>
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>{id ? 'Editar Tipo de Item' : 'Nuevo Tipo de Item'}</CardTitle>
              <CardDescription>
                {id
                  ? 'Modifica los datos del tipo de item'
                  : 'Complete los datos para crear un nuevo tipo de item'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input placeholder="Código del tipo de item" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del tipo de item" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripción del tipo de item"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between space-x-2">
                          <div className="space-y-0.5">
                            <FormLabel>Estado Activo</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Determina si el tipo de item está activo en el sistema
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 justify-end mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/item-types')}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

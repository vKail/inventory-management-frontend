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
      description: ''
    },
  })

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const itemType = await getItemTypeById(id)
          if (itemType) {
            form.reset({
              code: itemType.code || '',
              name: itemType.name || '',
              description: itemType.description || ''
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
      if (id) {
        await updateItemType(id, data)
        toast.success('Tipo de item actualizado exitosamente')
      } else {
        await addItemType(data)
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
    <Card>
      <CardHeader>
        <CardTitle>Información del Tipo de Item</CardTitle>
        <CardDescription>
          Ingrese los datos requeridos para el tipo de item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input placeholder="Código del tipo de item" maxLength={10} {...field} />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value?.length || 0}/10 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre del tipo de ítem"
                      maxLength={25}
                      textOnly={true}
                      shouldAutoCapitalize={true}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value?.length || 0}/25 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción del tipo de ítem"
                      maxLength={250}
                      descriptionOnly={true}
                      shouldAutoCapitalize={true}
                      {...field}
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value?.length || 0}/250 caracteres
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/item-types')}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="cursor-pointer">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {id ? "Actualizando..." : "Creando..."}
                  </>
                ) : (
                  id ? "Actualizar" : "Crear"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

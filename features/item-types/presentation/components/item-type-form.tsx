'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { itemTypeSchema, ItemTypeFormValues } from '../../data/schemas/item-type-schema'
import { createItemType, fetchItemTypeById, updateItemType } from '../../services/item-type.service'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function ItemTypeForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const [loading, setLoading] = useState(false)

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
    const load = async () => {
      if (id) {
        try {
          const itemType = await fetchItemTypeById(id)
          form.reset({ ...itemType, active: itemType.active ?? true })
        } catch (err) {
          toast.error('Error loading item type')
        }
      }
    }
    load()
  }, [id, form])

  const onSubmit = async (data: ItemTypeFormValues) => {
    setLoading(true)
    try {
      const { active, ...payload } = data
      if (id) {
        await updateItemType(id, payload)
        toast.success('Tipo de item actualizado')
      } else {
        await createItemType(payload)
        toast.success('Tipo de item creado')
      }
      router.push('/dashboard/item-types')
    } catch (err) {
      toast.error('Ocurrió un error al guardar')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-12 w-full">
      <div className="w-full max-w-[1200px]">
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Editar Tipo de Item' : 'Nuevo Tipo de Item'}</CardTitle>
            <CardDescription>
              {id
                ? 'Edita la información del tipo de item.'
                : 'Completa los datos para registrar un tipo de item.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Código del tipo" />
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
                        <Input {...field} placeholder="Nombre del tipo" />
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
                        <Textarea {...field} placeholder="Descripción" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <FormLabel>Estado</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

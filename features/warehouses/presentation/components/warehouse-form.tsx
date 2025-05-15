'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { fetchWarehouseById, createWarehouse, updateWarehouse } from '../../services/warehouse.service'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  location: z.string().min(1, 'Required'),
  responsibleId: z.number(),
  description: z.string().min(1, 'Required'),
  active: z.boolean().default(true).optional(),
})

type FormValues = z.infer<typeof schema>

const responsibles = [
  { id: 1, name: 'Juan Pérez' },
  { id: 2, name: 'María García' },
]

export default function WarehouseForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      location: '',
      responsibleId: 1,
      description: '',
      active: true,
    },
  })

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          const warehouse = await fetchWarehouseById(id)
          form.reset({
            ...warehouse,
            responsibleId: Number(warehouse.responsibleId),
            active: warehouse.active ?? true,
          })
        } catch (err) {
          console.error('Error loading warehouse:', err)
        }
      }
    }
    loadData()
  }, [id, form])

const onSubmit = async (data: FormValues) => {
  setLoading(true)
  try {
    const { active, ...dataToSend } = data

    if (id) {
      await updateWarehouse(id, dataToSend)
    } else {
      await createWarehouse(dataToSend)
    }

    router.push('/warehouses')
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="flex flex-col items-center w-full px-6 md:px-12">
      <div className="w-full max-w-[1200px]">
        <Card>
          <CardHeader>
            <CardTitle>{id ? 'Editar Almacén' : 'Nuevo Almacén'}</CardTitle>
            <CardDescription>
              {id ? 'Edita los datos del almacén.' : 'Completa los datos para registrar un almacén.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nombre del almacén" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Dirección" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsibleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <Select
                          defaultValue={field.value?.toString()}
                          onValueChange={(val) => field.onChange(Number(val))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un responsable" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {responsibles.map((r) => (
                              <SelectItem key={r.id} value={r.id.toString()}>
                                {r.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Descripción del almacén" />
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
                        <FormLabel className="text-base">Estado</FormLabel>
                        <FormDescription>Indica si el almacén está activo</FormDescription>
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

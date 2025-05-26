'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { warehouseService } from '../../services/warehouse.service'
import { warehouseSchema, type WarehouseFormValues } from '../../data/schemas/warehouse-schema'
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
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Building2 } from 'lucide-react'

interface WarehouseFormProps {
  id?: string
}

export default function WarehouseForm({ id }: WarehouseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
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
          const warehouse = await warehouseService.getWarehouseById(id)
          if (warehouse) {
            form.reset({
              ...warehouse,
              responsibleId: Number(warehouse.responsibleId),
              active: warehouse.active ?? true,
            })
          }
        } catch (err) {
          console.error('Error loading warehouse:', err)
          toast.error('Error al cargar el almacén')
        }
      }
    }
    loadData()
  }, [id, form])

  const onSubmit = async (data: WarehouseFormValues) => {
    setLoading(true)
    try {
      const { active, ...dataToSend } = data

      if (id) {
        await warehouseService.updateWarehouse(id, dataToSend)
        toast.success('Almacén actualizado exitosamente')
      } else {
        await warehouseService.createWarehouse(dataToSend)
        toast.success('Almacén creado exitosamente')
      }
      router.push('/warehouses')
    } catch (error) {
      toast.error('Ocurrió un error al guardar el almacén')
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/settings">Configuración</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/warehouses" className="flex items-center">
                <Building2 className="h-4 w-4 text-primary mr-1" />
                Almacenes
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{id ? 'Editar Almacén' : 'Nuevo Almacén'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-2xl font-bold tracking-tight mt-2">{id ? 'Editar Almacén' : 'Nuevo Almacén'}</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <h3 className="text-lg font-semibold mb-1">Detalles del almacén</h3>
          <p className="text-muted-foreground text-sm">
            Ingresa la información general del almacén.
          </p>
        </div>
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>{id ? 'Editar Almacén' : 'Nuevo Almacén'}</CardTitle>
              <CardDescription>
                {id
                  ? 'Modifica los datos del almacén'
                  : 'Complete los datos para crear un nuevo almacén'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del almacén" {...field} />
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
                          <Input placeholder="Ubicación del almacén" {...field} />
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
                            placeholder="Descripción del almacén"
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
                              Determina si el almacén está activo en el sistema
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
                      onClick={() => router.push('/warehouses')}
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

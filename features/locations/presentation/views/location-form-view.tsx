'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { locationSchema, LocationFormValues } from '../../schemas/location-schema'
import { useLocationForm } from '../../hooks/use-location-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LocationType } from '../../enums/location-type.enum'
import { CapacityUnit } from '../../enums/capacity-unit.enum'
import { MapPin } from 'lucide-react'

export default function LocationFormView() {
  const router = useRouter()

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      description: '',
      warehouseId: 1,
      parentLocationId: null,
      type: '',
      building: '',
      floor: '',
      reference: '',
      capacity: 0,
      capacityUnit: '',
      occupancy: 0,
      qrCode: '',
      coordinates: '',
      notes: '',
      active: true,
    },
  })

  const { onSubmit } = useLocationForm()

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
              <BreadcrumbPage>Crear Ubicación</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="text-2xl font-bold tracking-tight">Nueva Ubicación</h2>
        <p className="text-muted-foreground">
          Complete el formulario para registrar una nueva ubicación en el sistema.
        </p>
      </div>

      <Card className="w-[1200px] min-w-[1200px] max-w-[1200px] mx-auto">
        <CardHeader>
          <CardTitle>Formulario de Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input placeholder="Nombre de la ubicación" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione un tipo" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={LocationType.WAREHOUSE}>Almacén</SelectItem>
                        <SelectItem value={LocationType.OFFICE}>Oficina</SelectItem>
                        <SelectItem value={LocationType.LABORATORY}>Laboratorio</SelectItem>
                        <SelectItem value={LocationType.SERVER_ROOM}>Sala de Servidores</SelectItem>
                        <SelectItem value={LocationType.MAINTENANCE}>Área de Mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="building" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edificio</FormLabel>
                    <FormControl><Input placeholder="Nombre del edificio" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="floor" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Piso</FormLabel>
                    <FormControl><Input placeholder="Número o nombre del piso" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="capacity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl><Input type="number" placeholder="Capacidad máxima" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="capacityUnit" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad de capacidad</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione unidad" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={CapacityUnit.UNITS}>Unidades</SelectItem>
                        <SelectItem value={CapacityUnit.METERS}>Metros</SelectItem>
                        <SelectItem value={CapacityUnit.SQUARE_METERS}>Metros cuadrados</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="occupancy" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ocupación actual</FormLabel>
                    <FormControl><Input type="number" placeholder="Cantidad ocupada" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="qrCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código QR</FormLabel>
                    <FormControl><Input placeholder="Código identificador" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="coordinates" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coordenadas</FormLabel>
                    <FormControl><Input placeholder="Latitud, Longitud" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="reference" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia</FormLabel>
                    <FormControl><Input placeholder="Referencia del lugar" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="active" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'true')}
                      value={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione estado" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Activo</SelectItem>
                        <SelectItem value="false">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl><Textarea placeholder="Descripción de la ubicación" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales</FormLabel>
                  <FormControl><Textarea placeholder="Observaciones opcionales" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="mt-6 flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => router.push('/locations')}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

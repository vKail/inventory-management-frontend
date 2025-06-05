'use client'

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { locationSchema, LocationFormValues } from '../../schemas/location.schema'
import { ILocation, LocationTypeLabels, CapacityUnitLabels } from '../../data/interfaces/location.interface'
import { useEffect } from "react"
import { useLocationStore } from "../../context/location-store"

interface LocationFormProps {
  initialData?: ILocation
  onSubmit: (data: LocationFormValues) => Promise<void>
  isLoading: boolean
}

export function LocationForm({ initialData, onSubmit, isLoading }: LocationFormProps) {
  const router = useRouter()
  const { locations, getLocations } = useLocationStore()

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      parentLocationId: null,
      type: "BUILDING",
      floor: "",
      reference: "",
      capacity: 0,
      capacityUnit: "UNITS",
      occupancy: 0,
      qrCode: "",
      coordinates: "",
      notes: "",
    },
  })

  useEffect(() => {
    const loadData = async () => {
      await getLocations()
    }
    loadData()
  }, [getLocations])

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        parentLocationId: initialData.parentLocationId,
        type: initialData.type,
        floor: initialData.floor,
        reference: initialData.reference,
        capacity: initialData.capacity,
        capacityUnit: initialData.capacityUnit,
        occupancy: initialData.occupancy,
        qrCode: initialData.qrCode,
        coordinates: initialData.coordinates,
        notes: initialData.notes,
      })
    }
  }, [initialData, form])

  const handleSubmit = async (data: LocationFormValues) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Detalles Básicos</h3>
            <p className="text-muted-foreground text-sm">
              Información general de la ubicación.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>{initialData ? "Editar Ubicación" : "Nueva Ubicación"}</CardTitle>
                <CardDescription>
                  {initialData
                    ? "Modifica los datos de la ubicación"
                    : "Complete los datos para crear una nueva ubicación"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentLocationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación Padre</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? null : Number(value))
                        }
                        value={field.value?.toString() || "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una ubicación padre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Ninguna</SelectItem>
                          {locations
                            .filter((loc): loc is ILocation & { id: number } =>
                              typeof loc.id === 'number' && loc.id !== initialData?.id
                            )
                            .map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.id.toString()}
                              >
                                {location.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Detalles de Ubicación</h3>
            <p className="text-muted-foreground text-sm">
              Información específica sobre la ubicación física.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(LocationTypeLabels).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Piso (Opcional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacityUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidad</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(CapacityUnitLabels).map(([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {label}
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
                  name="occupancy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocupación</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
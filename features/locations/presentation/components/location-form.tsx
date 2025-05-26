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
import { locationSchema, LocationFormValues } from '../../data/schemas/location.schema'
import { ILocation } from '../../data/interfaces/location.interface'
import { useEffect } from "react"
import { useLocationStore } from "../../context/location-store"
import { useWarehouseStore } from "@/features/warehouses/context/warehouse-store"

// Enums for location types and capacity units
const LocationTypes = {
  BUILDING: "BUILDING",
  FLOOR: "FLOOR",
  OFFICE: "OFFICE",
  WAREHOUSE: "WAREHOUSE",
  SHELF: "SHELF",
  LABORATORY: "LABORATORY",
} as const;

const CapacityUnits = {
  UNITS: "UNITS",
  METERS: "METERS",
  SQUARE_METERS: "SQUARE_METERS",
} as const;

interface LocationFormProps {
  initialData?: ILocation
  onSubmit: (data: LocationFormValues) => Promise<void>
  isLoading: boolean
}

export function LocationForm({ initialData, onSubmit, isLoading }: LocationFormProps) {
  const router = useRouter()
  const { locations, getLocations } = useLocationStore()
  const { warehouses, getWarehouses } = useWarehouseStore()

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      description: "",
      warehouseId: 0,
      parentLocationId: null,
      type: "BUILDING" as const,
      building: "",
      floor: "",
      reference: "",
      capacity: 0,
      capacityUnit: "UNITS" as const,
      occupancy: 0,
      qrCode: "",
      coordinates: "",
      notes: "",
    },
  })

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        getLocations(),
        getWarehouses()
      ])
    }
    loadData()
  }, [getLocations, getWarehouses])

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        warehouseId: initialData.warehouseId,
        parentLocationId: initialData.parentLocationId,
        type: initialData.type as "BUILDING" | "FLOOR" | "OFFICE" | "WAREHOUSE" | "SHELF" | "LABORATORY",
        building: initialData.building,
        floor: initialData.floor,
        reference: initialData.reference,
        capacity: initialData.capacity,
        capacityUnit: initialData.capacityUnit as "UNITS" | "METERS" | "SQUARE_METERS",
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
                  name="warehouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Almacén</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un almacén" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map((warehouse) => (
                            <SelectItem
                              key={warehouse.id}
                              value={warehouse.id.toString()}
                            >
                              {warehouse.name}
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
                            .filter((loc) => loc.id !== initialData?.id)
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
                          {Object.entries(LocationTypes).map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {key}
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
                  name="building"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edificio</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="floor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Piso</FormLabel>
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
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Capacidad y Ocupación</h3>
            <p className="text-muted-foreground text-sm">
              Detalles sobre la capacidad y ocupación de la ubicación.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardContent className="space-y-4 pt-6">
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
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
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
                        <FormLabel>Unidad de Capacidad</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una unidad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(CapacityUnits).map(([key, value]) => (
                              <SelectItem key={value} value={value}>
                                {key}
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
                    name="occupancy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ocupación</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-x-8 gap-y-8 w-full">
          <div className="md:w-1/3">
            <h3 className="text-lg font-semibold mb-1">Información Adicional</h3>
            <p className="text-muted-foreground text-sm">
              Detalles adicionales sobre la ubicación.
            </p>
          </div>
          <div className="md:w-2/3">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <FormField
                  control={form.control}
                  name="qrCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código QR</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordenadas</FormLabel>
                      <FormControl>
                        <Input {...field} />
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/locations")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Guardar Cambios" : "Crear Ubicación"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
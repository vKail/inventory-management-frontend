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
import { locationSchema } from '@/features/locations/data/schemas/location.schema';
import { ILocation, LocationTypeLabels, CapacityUnitLabels } from '../../data/interfaces/location.interface'
import { LocationFormValues } from '@/features/locations/data/schemas/location.schema';
import { useEffect } from "react"
import { useLocationStore } from "../../context/location-store"

interface LocationFormProps {
  initialData?: ILocation | null
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
        name: initialData.name || "",
        description: initialData.description || "",
        parentLocationId: initialData.parentLocationId ?? null,
        type: initialData.type || "BUILDING",
        floor: initialData.floor || "",
        reference: initialData.reference || "",
        capacity: initialData.capacity || 0,
        capacityUnit: initialData.capacityUnit || "UNITS",
        occupancy: initialData.occupancy || 0,
        notes: initialData.notes || "",
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
        {/* Detalles Básicos */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
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
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nombre de la ubicación"
                          maxLength={30}
                          shouldAutoCapitalize={true}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;
                            value = value.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/30 caracteres
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
                          placeholder="Descripción de la ubicación"
                          maxLength={250}
                          shouldAutoCapitalize={true}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;
                            value = value.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/250 caracteres
                      </div>
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
        {/* Detalles de Ubicación */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
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
                      <FormLabel>Tipo *</FormLabel>
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
                        <Input
                          placeholder="Ej: 1, 2, -1, A1, B_2"
                          maxLength={10}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            let value = e.target.value;

                            // Allow only numbers, letters, dash and underscore
                            value = value.replace(/[^a-zA-Z0-9\-_]/g, '');

                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground">
                        Solo letras, números, guiones (-) y guiones bajos (_)
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: REF-001, A1_B2, LOC_123"
                          maxLength={50}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Allow only numbers, letters, dash, underscore and spaces
                            value = value.replace(/[^a-zA-Z0-9\-_\s]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/50 caracteres
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Solo letras, números, guiones (-), guiones bajos (_) y espacios
                      </div>
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
                        <FormLabel>Capacidad *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Capacidad"
                            maxLength={6}
                            {...field}
                            value={field.value === 0 || field.value === undefined ? 0 : field.value}
                            onChange={(e) => {
                              let value = e.target.value.replace(/[^0-9]/g, "");
                              if (value.length > 6) value = value.slice(0, 6);
                              field.onChange(value === '' ? 0 : Number(value));
                            }}
                            onBlur={(e) => {
                              if (e.target.value === '' || e.target.value === undefined) {
                                field.onChange(0);
                              }
                            }}
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground text-right">
                          {field.value?.toString().length || 0}/6 dígitos
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacityUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unidad *</FormLabel>
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
                      <FormLabel>Ocupación (Opcional, 0 por defecto)</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="Ocupación"
                          min={0}
                          maxLength={6}
                          {...field}
                          value={field.value === 0 || field.value === undefined ? 0 : field.value}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, "");
                            if (value.length > 6) value = value.slice(0, 6);
                            field.onChange(value === '' ? 0 : Number(value));
                          }}
                          onBlur={(e) => {
                            if (e.target.value === '' || e.target.value === undefined) {
                              field.onChange(0);
                            }
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.toString().length || 0}/6 dígitos
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notas adicionales sobre la ubicación"
                          maxLength={250}
                          shouldAutoCapitalize={true}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value;
                            value = value.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\-_\s]/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground text-right">
                        {field.value?.length || 0}/250 caracteres
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Button row */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="default" disabled={isLoading}>
            {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 
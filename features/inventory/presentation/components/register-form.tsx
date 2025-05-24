"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  RegisterFormSchema,
} from "@/features/inventory/data/schemas/register-schema";
import { RegisterFormFields } from "./register-form-fields";
import { RegisterFormActions } from "./register-form-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { RegisterService } from "@/features/inventory/services/register-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, DayPickerProvider } from "react-day-picker";
import { useEffect, useState } from "react";
import { InventoryFilterService } from "@/features/inventory/services/inventory.service";
import { FilterOption } from "@/features/inventory/data/interfaces/inventory.interface";

export const RegisterForm = () => {
  const [colors, setColors] = useState<FilterOption[]>([]);
  const [materials, setMaterials] = useState<FilterOption[]>([]);
  const [locations, setLocations] = useState<FilterOption[]>([]);
  const [offices, setOffices] = useState<FilterOption[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedColors = await InventoryFilterService.getCategories();
        const fetchedMaterials = await InventoryFilterService.getCategories();
        const fetchedLocations = await InventoryFilterService.getLocations();
        const fetchedOffices = await InventoryFilterService.getLocations();
        setColors(fetchedColors);
        setMaterials(fetchedMaterials);
        setLocations(fetchedLocations);
        setOffices(fetchedOffices);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Error al cargar las opciones del formulario");
      }
    };
    fetchOptions();
  }, []);

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      codigoBien: "",
      codigoAnterior: "",
      identificador: "",
      nroActaMatriz: "",
      bldBca: undefined,
      bien: "",
      serieIdentificacion: "",
      modeloCaracteristicas: "",
      marcaRazaOtros: "",
      color: "",
      material: "",
      dimensiones: "",
      custodioActual: "",
      itemRenglon: "",
      cuentaContable: "",
      fechaIngreso: new Date(),
      valorContable: 0,
      ubicacion: "",
      oficinaLaboratorio: "",
    },
  });

  const onSubmit = async (data: RegisterFormSchema) => {
    try {
      const success = await RegisterService.registerItem(data);
      if (success) {
        toast.success("✅ Bien registrado correctamente");
        form.reset();
      } else {
        toast.error("❌ Error al registrar el bien");
      }
    } catch (error) {
      toast.error("⚠️ Ocurrió un error inesperado");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Identificación y Códigos</CardTitle>
            <CardDescription>Datos básicos para identificar el bien en el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterFormFields control={form.control} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características del Bien</CardTitle>
            <CardDescription>Información detallada sobre el bien.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="bien"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bien (nombre)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre del bien" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serieIdentificacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serie/Identificación</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Serie o identificación" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modeloCaracteristicas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo/Características</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Modelo o características" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marcaRazaOtros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca/Raza/Otros</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Marca, raza u otros" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color.id} value={color.name}>
                            {color.name}
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
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materials.map((material) => (
                          <SelectItem key={material.id} value={material.name}>
                            {material.name}
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
                name="dimensiones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensiones</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Dimensiones del bien" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación y Responsable</CardTitle>
            <CardDescription>
              ¿Dónde se encuentra el bien y quién es el responsable?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="custodioActual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custodio Actual</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre del custodio actual" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ubicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una ubicación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.id} value={location.name}>
                            {location.name}
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
                name="oficinaLaboratorio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Oficina/Laboratorio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una oficina" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {offices.map((office) => (
                          <SelectItem key={office.id} value={office.name}>
                            {office.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Contable</CardTitle>
            <CardDescription>Datos contables y administrativos del bien.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="itemRenglon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ítem/Renglón</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ítem o renglón" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cuentaContable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta Contable</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Cuenta contable" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fechaIngreso"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Ingreso</FormLabel>
                    <DayPickerProvider initialProps={{ mode: "single" }}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "outline w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: es })
                              ) : (
                                <span>Selecciona una fecha</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                    </DayPickerProvider>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorContable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Contable</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : 0);
                        }}
                        placeholder="Valor contable"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <RegisterFormActions isSubmitting={form.formState.isSubmitting} onCancel={form.reset} />
      </form>
    </Form>
  );
};
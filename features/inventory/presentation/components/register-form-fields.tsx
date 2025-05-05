"use client";

import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Control } from "react-hook-form";
import { RegisterFormSchema } from "@/features/inventory/data/schemas/register-schema";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface RegisterFormFieldsProps {
  control: Control<RegisterFormSchema>;
}

export const RegisterFormFields = ({ control }: RegisterFormFieldsProps) => {
  return (
    <>
      {/* Sección: Bien */}
      <h3 className="font-bold text-lg mb-2">Datos del Bien</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormField
          control={control}
          name="codigoBien"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Código del Bien
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. 001-ABC"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nombreBien"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Nombre del Bien
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Computadora"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="colorBien"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Color del Bien
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Negro"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="codigoAnterior"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Código Anterior
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Si aplica"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="serieIdentificacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Serie/Identificación
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. SN123456"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="materialPrincipal"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Material Principal
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Plástico, Metal"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="identificadorUnico"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Identificador Único
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. UID-7890"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="modeloCaracteristicas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Modelo/Características
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Dell Inspiron 15"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dimensiones"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Dimensiones
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. 120x80x74 cm"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="numeroActaMatriz"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                No. de Acta/Matriz
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. ACT-2024-001"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="marcaOtrosDatos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Marca, otros datos
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. HP, año 2022"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fechaIngreso"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="font-bold block mb-1">
                Fecha de Ingreso
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP", { locale: es })
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sección: Información Adicional */}
      <h3 className="font-bold text-lg mb-2">Información Adicional</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FormField
          control={control}
          name="nombreCustodio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Nombre del Custodio
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Juan Pérez"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="numeroItemRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Número de Ítem o Región
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. 12 o Sierra-Centro"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="codigoCuentaContable"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Código de Cuenta Contable
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. 123.456.789"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="valorContable"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Valor Contable
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. $250.00"
                  className="p-2 rounded w-full"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    field.onChange(value ? parseFloat(value) : 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ubicacionFisica"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Ubicación Física del Bien
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Edificio A, Piso 2"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="oficinaLaboratorio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold block mb-1">
                Oficina o Laboratorio
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej. Lab. Sistemas"
                  className="p-2 rounded w-full"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

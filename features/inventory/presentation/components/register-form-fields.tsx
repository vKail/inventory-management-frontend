// /features/inventory/components/register-form-fields.tsx
"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { RegisterFormSchema } from "@/features/inventory/data/schemas/register-schema";

// Mocks para selects
const mockColors = [
  { id: 1, name: "Rojo" },
  { id: 2, name: "Azul" },
  { id: 3, name: "Verde" },
  { id: 4, name: "Amarillo" },
];

const mockMaterials = [
  { id: 1, name: "Madera" },
  { id: 2, name: "Acero" },
  { id: 3, name: "Plástico" },
];

const mockLocations = [
  { id: 1, name: "Ubicación Central" },
  { id: 2, name: "Almacén Secundario" },
];

const mockOffices = [
  { id: 1, name: "Oficina 101" },
  { id: 2, name: "Laboratorio A" },
];

interface RegisterFormFieldsProps {
  control: Control<RegisterFormSchema>;
}

export const RegisterFormFields = ({ control }: RegisterFormFieldsProps) => {
  return (
    <>
      {/* Sección 1: Identificación y Códigos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={control}
          name="codigoBien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código del Bien</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Código único del bien" />
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
              <FormLabel>Código Anterior</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Código anterior del bien" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="identificador"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificador</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Identificador único" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="nroActaMatriz"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nro de Acta/Matriz</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Número de acta o matriz" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bldBca"
          render={({ field }) => (
            <FormItem>
              <FormLabel>(BLD) o (BCA)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="BLD">BLD</SelectItem>
                  <SelectItem value="BCA">BCA</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
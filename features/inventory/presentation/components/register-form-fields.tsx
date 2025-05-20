"use client";

import { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScanLine } from "lucide-react";
import { RegisterFormSchema } from "@/features/inventory/data/schemas/register-schema";
import { ScanModal } from "./scan-modal";

interface RegisterFormFieldsProps {
  control: Control<RegisterFormSchema>;
}

export const RegisterFormFields = ({ control }: RegisterFormFieldsProps) => {
  const [scanOpen, setScanOpen] = useState(false);
  const [onScan, setOnScan] = useState<(code: string) => void>(() => () => {});

  return (
    <>
      <ScanModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onScanComplete={(value) => {
          onScan(value);
          setScanOpen(false);
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Código del Bien con botón de escanear */}
        <FormField
          control={control}
          name="codigoBien"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código del Bien</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input {...field} placeholder="Código único del bien" />
                </FormControl>
                <ScanLine
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setOnScan(() => field.onChange);
                    setScanOpen(true);
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Identificador */}
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

        {/* Nro de Acta/Matriz */}
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

        {/* BLD o BCA */}
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

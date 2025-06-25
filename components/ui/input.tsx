import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  textOnly?: boolean; // Para campos que solo deben contener texto
  shouldAutoCapitalize?: boolean; // Para capitalizar automáticamente (custom logic)
  codeOnly?: boolean; // Para códigos que permiten letras, números y espacios pero no caracteres especiales
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, textOnly = false, shouldAutoCapitalize = false, codeOnly = false, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Si es campo de solo texto, validar y formatear
      if (textOnly) {
        // Remover números y caracteres especiales excepto espacios y puntuación básica
        value = value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|<>\/]/g, '');
      }

      // Si es campo de código, validar sin caracteres especiales pero permitir números
      if (codeOnly) {
        // Solo permite letras, números y espacios
        value = value.replace(/[^a-zA-Z0-9\s]/g, '');
      }

      // Si shouldAutoCapitalize está activado, capitalizar primera letra de cada palabra
      if (shouldAutoCapitalize && value) {
        value = value
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      // Crear un nuevo evento con el valor procesado
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value
        }
      };

      // Llamar al onChange original con el evento modificado
      if (onChange) {
        onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

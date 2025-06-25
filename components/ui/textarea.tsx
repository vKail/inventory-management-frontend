import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  textOnly?: boolean; // Para campos que solo deben contener texto
  shouldAutoCapitalize?: boolean; // Para capitalizar automáticamente (custom logic)
  descriptionOnly?: boolean; // Para descripciones que permiten letras, números y signos de puntuación básicos
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textOnly = false, shouldAutoCapitalize = false, descriptionOnly = false, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let value = e.target.value;

      // Si es campo de solo texto, validar y formatear
      if (textOnly) {
        // Remover números y caracteres especiales excepto espacios y puntuación básica
        value = value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|<>\/]/g, '');
      }

      // Si es campo de descripción, validar con caracteres específicos
      if (descriptionOnly) {
        // Permite letras, números, espacios y signos de puntuación básicos para descripciones
        value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:!?()\-_]/g, '');
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
        onChange(newEvent as React.ChangeEvent<HTMLTextAreaElement>);
      }
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

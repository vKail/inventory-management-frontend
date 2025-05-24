'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Location } from "@/features/locations/data/interfaces/location.interface"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ColumnProps {
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<Location>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "capacity",
    header: "Capacidad",
  },
  {
    accessorKey: "department",
    header: "Departamento",
    cell: ({ row }) => {
      const department = row.getValue("department") as string;
      return department.charAt(0).toUpperCase() + department.slice(1);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const location = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(location)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(location)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 
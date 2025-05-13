"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface State {
  id: number;
  name: string;
  description: string;
  requiresMaintenance: boolean;
  active: boolean;
}

interface Props {
  data: State[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function StateTable({ data, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (data.length === 0) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <span>No states available</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Mantenimiento</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((state) => (
          <TableRow key={state.id}>
            <TableCell>{state.name}</TableCell>
            <TableCell>{state.description}</TableCell>
            <TableCell>
              <Badge variant={state.requiresMaintenance ? "destructive" : "default"}>
                {state.requiresMaintenance ? "Requiere" : "No Requiere"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={state.active ? "default" : "secondary"}>
                {state.active ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(state.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(state.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

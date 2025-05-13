// features/inventory/presentation/components/inventory-table-view.tsx
"use client";

import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { ProductStatus } from "@/features/inventory/data/interfaces/inventory.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  items: InventoryItem[];
  onViewClick?: (item: InventoryItem) => void;
  onLoanClick?: (item: InventoryItem) => void;
}

export const InventoryTableView = ({ items, onViewClick, onLoanClick }: Props) => {
  const statusColors = {
    [ProductStatus.AVAILABLE]: "bg-green-100 text-green-800",
    [ProductStatus.IN_USE]: "bg-blue-100 text-blue-800",
    [ProductStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
    [ProductStatus.DAMAGED]: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    [ProductStatus.AVAILABLE]: "Disponible",
    [ProductStatus.IN_USE]: "En uso",
    [ProductStatus.MAINTENANCE]: "En mantenimiento",
    [ProductStatus.DAMAGED]: "Dañado",
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {item.description}
                  </span>
                </div>
              </TableCell>
              <TableCell>{item.barcode}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <Badge
                  className={`${statusColors[item.status]} text-xs px-2 py-1 rounded-full`}
                  variant="outline"
                >
                  {statusLabels[item.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewClick?.(item)}
                  >
                    Ver
                  </Button>
                  {item.status === ProductStatus.AVAILABLE && (
                    <Button
                      size="sm"
                      onClick={() => onLoanClick?.(item)}
                    >
                      Solicitar
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Historial</DropdownMenuItem>
                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
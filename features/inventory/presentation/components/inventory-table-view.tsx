"use client";

import { useState } from "react";
import { InventoryItem, ProductStatus } from "@/features/inventory/data/interfaces/inventory.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EditProductModal } from "./edit-product-modal";
import { updateInventoryItem, deleteInventoryItem } from "@/features/inventory/services/inventory.service";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { toast } from "sonner";

interface Props {
  items: InventoryItem[];
  onViewClick?: (item: InventoryItem) => void;
  onLoanClick?: (item: InventoryItem) => void;
}

export const InventoryTableView = ({ items, onViewClick, onLoanClick }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const statusColors = {
    [ProductStatus.AVAILABLE]: "bg-green-100 text-green-800",
    [ProductStatus.IN_USE]: "bg-yellow-100 text-yellow-800",
    [ProductStatus.MAINTENANCE]: "bg-blue-100 text-blue-800",
    [ProductStatus.DAMAGED]: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    [ProductStatus.AVAILABLE]: "Disponible",
    [ProductStatus.IN_USE]: "En uso",
    [ProductStatus.MAINTENANCE]: "En mantenimiento",
    [ProductStatus.DAMAGED]: "Dañado",
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (updatedProduct: InventoryItem) => {
    try {
      const updated = await updateInventoryItem(updatedProduct.id, updatedProduct); // Usamos id directamente
      useInventoryStore.setState((state) => ({
        items: state.items.map((item) =>
          item.id === updated.id ? updated : item
        ),
        filteredItems: state.filteredItems.map((item) =>
          item.id === updated.id ? updated : item
        ),
      }));
      toast.success("Producto actualizado correctamente");
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al actualizar el producto";
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = async (item: InventoryItem) => {
    try {
      await deleteInventoryItem(item.id); // Usamos id directamente
      useInventoryStore.setState((state) => ({
        items: state.items.filter((i) => i.id !== item.id),
        filteredItems: state.filteredItems.filter((i) => i.id !== item.id),
      }));
      toast.success("Producto eliminado correctamente");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al eliminar el producto";
      toast.error(errorMessage);
    }
  };

  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[200px]">Producto</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {itemsArray.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.barcode}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.department}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                <Badge
                  className={`${statusColors[item.status]} px-2 py-1 rounded-full text-xs`}
                  variant="outline"
                >
                  {statusLabels[item.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewClick?.(item)}
                  >
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onLoanClick?.(item)}
                    disabled={item.status !== ProductStatus.AVAILABLE}
                  >
                    Solicitar
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(item)}>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Historial</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(item)}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <EditProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
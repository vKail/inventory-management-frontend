"use client";

import { useState } from "react";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
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
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InventoryDetailsModal } from "./inventory-details-modal";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface Props {
  items: InventoryItem[];
  onViewDetails: (item: InventoryItem) => void;
}

export const InventoryTableView = ({ items, onViewDetails }: Props) => {
  const router = useRouter();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<InventoryItem | null>(null);
  const { deleteInventoryItem } = useInventoryStore();

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedProduct(item);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    router.push(`/inventory/edit/${item.id}`);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setProductToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteInventoryItem(productToDelete.id);
        toast.success("Producto eliminado correctamente");
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error al eliminar el producto";
        toast.error(errorMessage);
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      }
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleViewDetails(item)}
            >
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>{item.category?.name || "Sin categoría"}</TableCell>
              <TableCell>
                <Badge variant={item.status?.name === "Activo" ? "default" : "secondary"}>
                  {item.status?.name || "Sin estado"}
                </Badge>
              </TableCell>
              <TableCell>{item.location?.name || "Sin ubicación"}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(item);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <InventoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={selectedProduct}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
              y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
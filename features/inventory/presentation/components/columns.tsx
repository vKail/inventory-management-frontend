"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useInventoryStore } from "../../context/inventory-store";
import { toast } from "sonner";

export interface Column {
    header: string;
    accessorKey: keyof InventoryItem;
}

export const columns: Column[] = [
    {
        accessorKey: "code",
        header: "Código",
    },
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "stock",
        header: "Stock",
    },
    {
        accessorKey: "modelCharacteristics",
        header: "Modelo/Características",
    },
    {
        accessorKey: "brandBreedOther",
        header: "Marca/Raza/Otro",
    },
    {
        accessorKey: "normativeType",
        header: "Tipo Normativo",
    },
];

export const ActionsCell = ({ item }: { item: InventoryItem }) => {
    const router = useRouter();
    const { deleteInventoryItem } = useInventoryStore();

    const handleDelete = async () => {
        try {
            await deleteInventoryItem(item.id);
            toast.success("Producto eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar el producto");
        }
    };

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
                <DropdownMenuItem onClick={() => router.push(`/inventory/${item.id}`)}>
                    Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/inventory/edit/${item.id}`)}>
                    Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                    Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}; 
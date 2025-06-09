import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "../../../data/interfaces/inventory.interface";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useStateStore } from "@/features/states/context/state-store";

export const useColumns = () => {
    const { categories } = useCategoryStore();
    const { states } = useStateStore();

    const columns: ColumnDef<InventoryItem>[] = [
        {
            id: "code",
            accessorKey: "code",
            header: "Código",
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "stock",
            accessorKey: "stock",
            header: "Stock",
            cell: ({ row }) => {
                const stock = row.getValue("stock") as number;
                return (
                    <Badge variant={stock > 0 ? "default" : "destructive"}>
                        {stock}
                    </Badge>
                );
            },
        },
        {
            id: "statusId",
            accessorKey: "statusId",
            header: "Estado",
            cell: ({ row }) => {
                const statusId = row.getValue("id") as number;
                const status = states.find(s => s.id === statusId);
                return (
                    <Badge variant="outline">
                        {status?.name || "Sin estado"}
                    </Badge>
                );
            },
        },
        {
            id: "categoryId",
            accessorKey: "categoryId",
            header: "Categoría",
            cell: ({ row }) => {
                const categoryId = row.getValue("categoryId") as number;
                const category = categories.find(c => c.id === categoryId);
                return category?.name || "Sin categoría";
            },
        },
        {
            id: "acquisitionDate",
            accessorKey: "acquisitionDate",
            header: "Fecha de Adquisición",
            cell: ({ row }) => {
                const date = row.getValue("acquisitionDate") as string;
                return date ? format(new Date(date), "PPP", { locale: es }) : "Sin fecha";
            },
        },
        {
            id: "critical",
            accessorKey: "critical",
            header: "Crítico",
            cell: ({ row }) => {
                const critical = row.getValue("critical") as boolean;
                return (
                    <Badge variant={critical ? "destructive" : "secondary"}>
                        {critical ? "Sí" : "No"}
                    </Badge>
                );
            },
        },
    ];

    return columns;
}; 
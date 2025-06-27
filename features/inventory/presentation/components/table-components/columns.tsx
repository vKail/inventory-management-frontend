import { ColumnDef } from "@tanstack/react-table";
import { InventoryItem } from "../../../data/interfaces/inventory.interface";
import { Badge } from "@/components/ui/badge";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useStateStore } from "@/features/states/context/state-store";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useInventoryStore } from "../../../context/inventory-store";
import { toast } from "sonner";

export const useColumns = () => {
    const { categories } = useCategoryStore();
    const { states } = useStateStore();
    const router = useRouter();
    const { deleteInventoryItem } = useInventoryStore();

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteInventoryItem(id);
            toast.success("Item eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar el item");
        }
    };

    const columns: ColumnDef<InventoryItem>[] = [
        {
            id: "code",
            accessorKey: "code",
            header: "Código",
            size: 120,
            cell: ({ row }) => {
                const code = row.getValue("code") as string;
                return (
                    <div
                        className="max-w-[120px] truncate text-sm font-mono"
                        title={code}
                    >
                        {code || "Sin código"}
                    </div>
                );
            },
        },
        {
            id: "name",
            accessorKey: "name",
            header: "Nombre",
        },
        {
            id: "description",
            accessorKey: "description",
            header: "Descripción",
            size: 200,
            cell: ({ row }) => {
                const description = row.getValue("description") as string;
                return (
                    <div
                        className="max-w-[200px] truncate text-sm text-muted-foreground"
                        title={description}
                    >
                        {description || "Sin descripción"}
                    </div>
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
            id: "locationId",
            accessorKey: "locationId",
            header: "Departamento",
            cell: ({ row }) => {
                const location = row.original.location;
                return location?.name || "Sin departamento";
            },
        },
        {
            id: "stock",
            accessorKey: "stock",
            header: "Artículos en Stock",
            size: 150,
            cell: ({ row }) => {
                const stock = row.getValue("stock") as number;
                return (
                    <Badge
                        variant={stock < 10 ? "destructive" : "outline"}
                        className={stock < 10 ? "bg-red-500 text-white hover:bg-red-600" : ""}
                    >
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
                const status = row.original.status;
                return (
                    <Badge
                        variant={
                            status?.name?.toLowerCase() === 'disponible' ? 'default' :
                                status?.name?.toLowerCase() === 'en uso' ? 'secondary' :
                                    status?.name?.toLowerCase() === 'en mantenimiento' ? 'destructive' :
                                        'outline'
                        }
                        className={
                            status?.name?.toLowerCase() === 'disponible' ? 'bg-green-500 hover:bg-green-600' :
                                status?.name?.toLowerCase() === 'en uso' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                    status?.name?.toLowerCase() === 'en mantenimiento' ? 'bg-red-500 hover:bg-red-600' :
                                        'bg-blue-200 hover:bg-blue-300'
                        }
                    >
                        {status?.name || "Sin estado"}
                    </Badge>
                );
            },
        },
        {
            id: "availableForLoan",
            accessorKey: "availableForLoan",
            header: "Disponible para Préstamo",
            size: 150,
            cell: ({ row }) => {
                const availableForLoan = row.getValue("availableForLoan") as boolean;
                return (
                    <Badge
                        variant={availableForLoan ? "default" : "destructive"}
                        className={availableForLoan ? "bg-green-600 hover:bg-green-800" : "bg-red-500 text-white hover:bg-red-600"}
                    >
                        {availableForLoan ? "Sí" : "No"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/inventory/edit/${item.id}`);
                            }}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Se eliminará permanentemente el item.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={(e) => handleDelete(item.id.toString(), e)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        },
    ];

    return columns;
}; 
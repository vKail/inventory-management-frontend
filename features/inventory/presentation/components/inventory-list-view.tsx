import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInventoryStore } from "../../context/inventory-store";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface InventoryListViewProps {
    items: InventoryItem[];
}

export function InventoryListView({ items }: InventoryListViewProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const router = useRouter();
    const { deleteInventoryItem } = useInventoryStore();

    const handleItemClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsDetailsModalOpen(true);
    };

    const handleScanComplete = (item: InventoryItem | null) => {
        if (item) {
            setSelectedItem(item);
            setIsDetailsModalOpen(true);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteInventoryItem(id);
            toast.success("Item eliminado correctamente");
        } catch (error) {
            toast.error("Error al eliminar el item");
        }
    };

    const getStatusColor = (status: string | undefined) => {
        switch (status?.toLowerCase()) {
            case 'disponible':
                return 'bg-green-100 text-green-800';
            case 'en uso':
                return 'bg-yellow-100 text-yellow-800';
            case 'en mantenimiento':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
                <List className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <p className="mb-4 text-lg font-medium">No se encontraron items</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                    Intenta ajustar los filtros de búsqueda o crear un nuevo item.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="space-y-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                Código: {item.code}
                            </p>
                            <p className="text-sm">
                                Categoría: {item.category?.name}
                            </p>
                            <p className="text-sm">
                                Departamento: {item.location?.name}
                            </p>
                            <p className="text-sm">
                                Cantidad: {item.stock}
                            </p>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                            <Badge
                                className={`${getStatusColor(item.status?.name)}`}
                            >
                                {item.status?.name || "Sin estado"}
                            </Badge>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/inventory/edit/${item.id}`);
                                    }}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Eliminar
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
                        </div>
                    </div>
                ))}
            </div>

            <ScanProcessModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedItem(null);
                }}
                initialItem={selectedItem}
            />

            <ScanProcessModal
                isOpen={isScanModalOpen}
                onClose={() => {
                    setIsScanModalOpen(false);
                }}
                onScanComplete={handleScanComplete}
            />
        </>
    );
} 
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInventoryStore } from "../../context/inventory-store";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface InventoryGridViewProps {
    items: InventoryItem[];
}

export function InventoryGridView({ items }: InventoryGridViewProps) {
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const router = useRouter();
    const { deleteInventoryItem } = useInventoryStore();
    const url = process.env.NEXT_PUBLIC_API_URLIMAGE;

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
                <Box className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <p className="mb-4 text-lg font-medium">No se encontraron items</p>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                    Intenta ajustar los filtros de búsqueda o crear un nuevo item.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => {
                    const primaryImage = item.images?.find(img => img.type == 'PRIMARY');
                    return (
                        <Card
                            key={item.id}
                            className="rounded-lg border bg-card text-card-foreground shadow-sm h-full flex flex-col cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleItemClick(item)}
                        >
                            <div className="flex flex-col space-y-1.5 p-6 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-lg line-clamp-1">{item.name}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-1">
                                            {item.category?.name} - {item.location?.name}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(item.status?.name)}>
                                        {item.status?.name || "Sin estado"}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-6 flex-grow py-2">
                                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 overflow-hidden">
                                    {primaryImage ? (
                                        <img
                                            src={`${url}${primaryImage.filePath}`}
                                            alt={item.name}
                                            className="object-contain w-full h-full"
                                        />
                                    ) : (
                                        <>
                                            <div className="flex flex-col items-center justify-center h-full space-y-2">
                                                <Box className="h-12 w-12 text-muted-foreground" />
                                                <div className="text-muted-foreground text-sm">Sin imagen</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="grid gap-1">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Código:</span>
                                        <span className="text-sm font-medium">{item.code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Cantidad:</span>
                                        <span className="text-sm font-medium">{item.stock}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground pr-3">Descripción:</span>
                                        <span className="text-sm font-medium line-clamp-2">{item.description}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center p-6 pt-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
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
                                            className="flex-1 text-red-600 hover:text-red-700"
                                            onClick={(e) => e.stopPropagation()}
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
                        </Card>
                    );
                })}
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
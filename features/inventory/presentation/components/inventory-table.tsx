"use client";

import { useInventoryStore } from "../../context/inventory-store";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";

interface InventoryTableProps {
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    searchTerm: string;
}

export const InventoryTable = ({
    currentPage,
    itemsPerPage,
    onPageChange,
    searchTerm
}: InventoryTableProps) => {
    const router = useRouter();
    const { items, getInventoryItems, deleteInventoryItem, loading, totalPages, isEmpty } = useInventoryStore();

    useEffect(() => {
        getInventoryItems(currentPage);
        console.log("YUMMIIIIII", items)
    }, [currentPage, getInventoryItems]);

    const handleDelete = async (id: string) => {
        try {
            await deleteInventoryItem(id);
            toast.success("Item eliminado correctamente");
            await getInventoryItems(currentPage);
        } catch (error) {
            toast.error("Error al eliminar el item");
        }
    };

    const filteredItems = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <EmptyState
                title="No hay items en el inventario"
                description="¿Deseas crear el primer item?"
                action={
                    <Button onClick={() => router.push("/inventory/new")}>
                        Crear Item
                    </Button>
                }
            />
        );
    }

    if (filteredItems.length === 0) {
        return (
            <div className="text-center p-8 text-muted-foreground">
                No se encontraron items que coincidan con la búsqueda
            </div>
        );
    }

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        try {
            return format(parseISO(dateString), "PPP", { locale: es });
        } catch (error) {
            return "Fecha inválida";
        }
    };

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Habilitado/DesHabilitado</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.stock}</TableCell>
                                <TableCell>
                                    <Badge>{item.status?.name}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.normativeType}</Badge>
                                </TableCell>
                                <TableCell>{item.availableForLoan}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
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
                                                        onClick={() => handleDelete(item.id.toString())}
                                                        disabled={loading}
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 0 && (
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </>
    );
}; 
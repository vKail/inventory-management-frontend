'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Wrench, X } from 'lucide-react';
import { toast } from 'sonner';
import { useItemTypeStore } from '../../context/item-types-store';
import LoaderComponent from '@/shared/components/ui/Loader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatNullValue, capitalizeWords } from '@/lib/utils';

export default function ItemTypeTable() {
    const router = useRouter();
    const {
        itemTypes,
        searchTerm,
        setSearchTerm,
        clearFilters,
        loading,
        getItemTypes,
        deleteItemType,
        currentPage,
        totalPages
    } = useItemTypeStore();

    const [itemTypeToDelete, setItemTypeToDelete] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadItemTypes = async () => {
            try {
                await getItemTypes(currentPage, itemsPerPage);
            } catch (error) {
                console.error('Error loading item types:', error);
                toast.error('Error al cargar los tipos de item');
            }
        };

        loadItemTypes();
    }, [getItemTypes, currentPage]);

    const confirmDelete = async () => {
        if (itemTypeToDelete === null) return;

        try {
            await deleteItemType(itemTypeToDelete);
            toast.success('Tipo de item eliminado exitosamente');
            await getItemTypes(currentPage, itemsPerPage);
        } catch (error) {
            console.error('Error deleting item type:', error);
            toast.error('Error al eliminar el tipo de item');
        } finally {
            setItemTypeToDelete(null);
        }
    }

    const handlePageChange = async (page: number) => {
        try {
            await getItemTypes(page, itemsPerPage);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="px-2 sm:px-4 md:px-8 pb-0">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto py-2 mb-4">
                        <Input
                            placeholder="Buscar por nombre o descripción..."
                            className="w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 cursor-pointer"
                                onClick={clearFilters}
                                title="Limpiar filtros"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Button
                        onClick={() => router.push('/item-types/new')}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Tipo
                    </Button>
                </div>
                <hr className="border-t border-muted mt-4" />
            </CardHeader>
            <CardContent className="px-2 sm:px-4 md:px-8 pb-6">
                <div className="min-h-[400px] flex flex-col justify-between">
                    <div className="overflow-x-auto border rounded-md shadow-sm">
                        <div className="min-w-full inline-block align-middle">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[120px] w-[15%]">Código</TableHead>
                                        <TableHead className="min-w-[200px] w-[20%]">Nombre</TableHead>
                                        <TableHead className="min-w-[300px] w-[45%]">Descripción</TableHead>
                                        <TableHead className="min-w-[100px] w-[10%] text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24">
                                                <LoaderComponent rows={5} columns={4} />
                                            </TableCell>
                                        </TableRow>
                                    ) : itemTypes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Wrench className="h-10 w-10 opacity-30" />
                                                    <span>No hay tipos de item para mostrar</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        itemTypes.map((itemType) => (
                                            <TableRow key={itemType.id} className="h-16 hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    {formatNullValue(itemType.code, "Sin código")}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatNullValue(capitalizeWords(itemType.name), "Sin nombre")}
                                                </TableCell>
                                                <TableCell className="max-w-[250px] truncate">
                                                    {formatNullValue(capitalizeWords(itemType.description), "Sin descripción")}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => router.push(`/item-types/edit/${itemType.id}`)}
                                                            className="cursor-pointer h-8 w-8"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => setItemTypeToDelete(itemType.id)}
                                                                    className="cursor-pointer h-8 w-8"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta acción no se puede deshacer. Se eliminará permanentemente el tipo de item
                                                                        <span className="font-semibold"> {formatNullValue(capitalizeWords(itemType.name), "Sin nombre")}</span>.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel onClick={() => setItemTypeToDelete(null)}>
                                                                        Cancelar
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={confirmDelete}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Eliminar
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                    {/* Pagination section, if present */}
                    {!loading && itemTypes.length > 0 && (
                        <div className="mt-4">
                            {/* Add your pagination component here, styled as in categories */}
                            {/* Example: <ItemTypePagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> */}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
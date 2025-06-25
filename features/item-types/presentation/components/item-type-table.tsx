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
        <div className="container mx-auto py-10">
            {/* Breadcrumbs, título y descripción */}
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Wrench className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/item-types">Tipos de Item</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Input
                            placeholder="Buscar por nombre o descripción..."
                            className="w-full md:w-64"
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
                        className="cursor-pointer"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Tipo
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Código</TableHead>
                                    <TableHead className="w-[200px]">Nombre</TableHead>
                                    <TableHead className="w-[500px]">Descripción</TableHead>
                                    <TableHead className="w-[100px] text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <LoaderComponent rows={5} columns={4} />
                                        </TableCell>
                                    </TableRow>
                                ) : itemTypes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-20 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Wrench className="h-10 w-10 opacity-30" />
                                                <span>No hay tipos de item para mostrar</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    itemTypes.map((itemType) => (
                                        <TableRow key={itemType.id} className="h-16">
                                            <TableCell className="font-medium py-3">
                                                {formatNullValue(itemType.code, "Sin código")}
                                            </TableCell>
                                            <TableCell className="font-medium py-3">
                                                {formatNullValue(capitalizeWords(itemType.name), "Sin nombre")}
                                            </TableCell>
                                            <TableCell className="max-w-[500px] py-3">
                                                <div className="truncate" title={itemType.description}>
                                                    {formatNullValue(capitalizeWords(itemType.description), "Sin descripción")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right py-3">
                                                <div className="flex items-center justify-end gap-2">
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
                </CardContent>
            </Card>
        </div>
    )
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useInventoryStore } from '../../context/inventory-store';
import LoaderComponent from '@/shared/components/ui/Loader';
import { InventoryPaginator } from './inventory-paginator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { InventoryForm } from './inventory-form';

export default function InventoryTable() {
    const router = useRouter();
    const { items, loading, currentPage, totalPages, getInventoryItems, createInventoryItem, deleteInventoryItem } = useInventoryStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                await getInventoryItems(1, itemsPerPage);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Error al cargar los datos');
            }
        };

        loadData();
    }, [getInventoryItems]);

    const handlePageChange = async (page: number) => {
        try {
            await getInventoryItems(page, itemsPerPage);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    const handleCreateItem = async (data: any) => {
        try {
            await createInventoryItem(data);
            setIsModalOpen(false);
            toast.success('Item creado exitosamente');
        } catch (error) {
            console.error('Error creating item:', error);
            toast.error('Error al crear el item');
        }
    };

    const handleDeleteItem = async (id: number) => {
        try {
            await deleteInventoryItem(id);
            toast.success('Item eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting item:', error);
            toast.error('Error al eliminar el item');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Inventario</CardTitle>
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Item
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <LoaderComponent rows={5} columns={6} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">Inventario</CardTitle>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Item
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Categoría</TableHead>
                                <TableHead>Ubicación</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-10 w-10 text-gray-400" />
                                            <p className="text-sm text-gray-600">No hay items registrados</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.code}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.category.name}</TableCell>
                                        <TableCell>{item.location.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.status.name}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => router.push(`/inventory/${item.id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDeleteItem(item.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {items.length > 0 && (
                        <div className="mt-4 flex justify-center">
                            <InventoryPaginator
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Nuevo Item</DialogTitle>
                        <DialogDescription>
                            Complete los detalles del item. Todos los campos marcados con * son obligatorios.
                        </DialogDescription>
                    </DialogHeader>

                    <InventoryForm onSubmit={handleCreateItem} isLoading={loading} />
                </DialogContent>
            </Dialog>
        </div>
    );
} 
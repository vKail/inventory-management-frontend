'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package } from 'lucide-react';
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
import { columns, ActionsCell } from './columns';
import { InventoryItem } from '../../data/interfaces/inventory.interface';

export default function InventoryTable() {
    const router = useRouter();
    const { items, loading, currentPage, totalPages, getInventoryItems, createInventoryItem } = useInventoryStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                await getInventoryItems(1);
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Error al cargar los datos');
            }
        };

        loadData();
    }, [getInventoryItems]);

    const handlePageChange = async (page: number) => {
        try {
            await getInventoryItems(page);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    const handleCreateItem = async (formData: any) => {
        try {
            // Convertir la fecha a string si es necesario
            const data: Partial<InventoryItem> = {
                ...formData,
                acquisitionDate: formData.acquisitionDate instanceof Date
                    ? formData.acquisitionDate.toISOString().split('T')[0]
                    : formData.acquisitionDate
            };

            await createInventoryItem(data);
            setIsModalOpen(false);
            toast.success('Item creado exitosamente');
        } catch (error) {
            console.error('Error creating item:', error);
            toast.error('Error al crear el item');
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
                                {columns.map((column) => (
                                    <TableHead key={column.accessorKey}>{column.header}</TableHead>
                                ))}
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="text-center py-10">
                                        <div className="flex flex-col items-center gap-2">
                                            <Package className="h-10 w-10 text-gray-400" />
                                            <p className="text-sm text-gray-600">No hay items registrados</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        {columns.map((column) => (
                                            <TableCell key={column.accessorKey}>
                                                {String(item[column.accessorKey])}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right">
                                            <ActionsCell item={item} />
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
'use client';
import { useEffect, useState } from 'react'
import { useWarehouseStore } from '../../context/warehouse-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import WarehouseTable from '../components/warehouse-table'
import Link from 'next/link'

import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog'

import {
    Breadcrumb, BreadcrumbList, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'

export default function WarehouseView() {
    const {
        warehouses,
        loading,
        getWarehouses,
        deleteWarehouse,
        currentPage,
        totalPages,
    } = useWarehouseStore();

    const [openDialog, setOpenDialog] = useState(false);
    const [warehouseIdToDelete, setWarehouseIdToDelete] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        loadWarehouses();
    }, [currentPage]);

    const loadWarehouses = async () => {
        try {
            await getWarehouses(currentPage, 10);
        } catch (error) {
            toast.error('Error al cargar los almacenes');
        }
    };

    const handlePageChange = async (page: number) => {
        try {
            await getWarehouses(page, 10);
        } catch (error) {
            toast.error('Error al cambiar de página');
        }
    };

    const handleDelete = async (id: number) => {
        setWarehouseIdToDelete(id);
        setOpenDialog(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/settings">Configuración</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Building2 className="h-4 w-4 text-primary inline mr-1" />
                                <BreadcrumbPage>Almacenes</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-2xl font-bold tracking-tight mt-2">Lista de Almacenes</h2>
                </div>
                <Button onClick={() => router.push('/warehouses/new')} className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Almacén
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <WarehouseTable
                        warehouses={warehouses}
                        onDelete={handleDelete}
                        loading={loading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </CardContent>
            </Card>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el almacén.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (warehouseIdToDelete !== null) {
                                    deleteWarehouse(warehouseIdToDelete);
                                    setOpenDialog(false);
                                    toast.success('Almacén eliminado exitosamente');
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 
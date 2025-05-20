'use client';
import { useEffect, useState } from 'react'
import { useColorStore } from '../../context/color-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import ColorTable from '../components/color-table'

import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from '@/components/ui/alert-dialog'

import {
    Breadcrumb, BreadcrumbList, BreadcrumbItem,
    BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaletteIcon, Plus } from 'lucide-react'

export default function ColorView() {
    const {
        colors,
        loading,
        getColors,
        deleteColor,
    } = useColorStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1, pages: 1, limit: 10, total: 0
    });

    const [openDialog, setOpenDialog] = useState(false);
    const [colorIdToDelete, setColorIdToDelete] = useState<string | null>(null);

    const router = useRouter();

    const loadColors = async (page = 1) => {
        const data = await getColors(page, 10);
        if (data) {
            setPagination({
                page: data.page,
                pages: data.pages,
                limit: data.limit,
                total: data.total
            });
        } else {
            toast.error('Error al cargar los colores');
        }
    };

    useEffect(() => {
        loadColors(currentPage);
    }, [currentPage]);

    const askDelete = (id: string) => {
        setColorIdToDelete(id);
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        if (!colorIdToDelete) return;
        try {
            await deleteColor(colorIdToDelete);
            toast.success('Color eliminado exitosamente');
            loadColors(currentPage);
        } catch (error) {
            toast.error('No se pudo eliminar el color');
            console.error(error);
        } finally {
            setOpenDialog(false);
            setColorIdToDelete(null);
        }
    };

    return (
        <>
            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar color?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El color se eliminará permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex w-full flex-col items-center px-6">
                <div className="w-full max-w-[1200px]">

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Configuración</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <PaletteIcon className="w-4 h-4 text-red-600 mr-1" />
                                <BreadcrumbPage>Colores</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="mb-6 mt-4">
                        <h1 className="text-3xl font-bold">Lista de Colores</h1>
                        <p className="text-gray-500 mt-1">Todos los colores registrados en el sistema</p>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-end">
                            <Button onClick={() => router.push('/colors/new')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Color
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <ColorTable
                                colors={colors}
                                onDelete={askDelete}
                                loading={loading}
                                onPageChange={(p) => setCurrentPage(p)}
                                pagination={pagination}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

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
    BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { PaletteIcon } from 'lucide-react'

export default function ColorView() {
    const {
        filteredColors,
        loading,
        getColors,
        deleteColor,
        currentPage,
        totalPages,
    } = useColorStore();

    const [openDialog, setOpenDialog] = useState(false);
    const [colorIdToDelete, setColorIdToDelete] = useState<number | null>(null);
    const [colorNameToDelete, setColorNameToDelete] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        loadColors();
    }, [currentPage]);

    const loadColors = async () => {
        try {
            await getColors(currentPage, 10);
        } catch (error) {
            toast.error('Error al cargar los colores');
        }
    };

    const handlePageChange = async (page: number) => {
        try {
            await getColors(page, 10);
        } catch (error) {
            toast.error('Error al cambiar de página');
        }
    };

    const handleDelete = async (id: number) => {
        const colorToDelete = filteredColors.find(color => color.id === id);
        setColorIdToDelete(id);
        setColorNameToDelete(colorToDelete?.name || '');
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        if (colorIdToDelete === null) return;

        try {
            await deleteColor(colorIdToDelete);
            toast.success('Color eliminado exitosamente');
            // Reload just the current page data
            await getColors(currentPage, 10);
        } catch (error) {
            toast.error('Error al eliminar el color');
        } finally {
            setOpenDialog(false);
            setColorIdToDelete(null);
            setColorNameToDelete('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <span className="text-muted-foreground font-medium">Configuración</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <PaletteIcon className="h-4 w-4 text-primary" />
                                <BreadcrumbPage>Colores</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <h2 className="text-2xl font-bold tracking-tight mt-2">Lista de Colores</h2>
                    <p className="text-muted-foreground">Todos los colores registrados en el sistema</p>
                </div>
            </div>

            <ColorTable
                colors={filteredColors}
                onDelete={handleDelete}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {colorNameToDelete ? (
                                <>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el color{' '}
                                    <span className="font-semibold">"{colorNameToDelete}"</span>.
                                </>
                            ) : (
                                'Esta acción no se puede deshacer. Se eliminará permanentemente el color.'
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {
                            setOpenDialog(false);
                            setColorIdToDelete(null);
                            setColorNameToDelete('');
                        }}>
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
    );
}

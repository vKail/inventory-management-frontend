'use client';
import { useEffect, useState } from 'react'
import { useColorStore } from '../../context/color-store'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import ColorTable from '../components/color-table'
import { Input } from '@/components/ui/input'
import { useSearchParams, useRouter as useNextRouter } from 'next/navigation'

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

// This component displays a list of colors with options to add, delete, and paginate through them.

export default function ColorView() {
    const {
        colors,
        loading,
        getColors,
        deleteColor,
        currentPage,
        totalPages,
        filters,
        setFilters,
    } = useColorStore();

    // State to manage the confirmation dialog for deleting a color
    const [openDialog, setOpenDialog] = useState(false);
    const [colorIdToDelete, setColorIdToDelete] = useState<number | null>(null);

    const router = useRouter();
    const nextRouter = useNextRouter();
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

    // Nuevo estado para los inputs de filtro
    const [filterValues, setFilterValues] = useState({
        name: filters.name || '',
        hexCode: filters.hexCode || '',
    });

    // Maneja el cambio de cualquier input de filtro
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filterValues, [name]: value };
        setFilterValues(newFilters);
        setFilters(newFilters);
        // Actualiza los search params en la URL
        const params = new URLSearchParams();
        if (newFilters.name) params.set('name', newFilters.name);
        if (newFilters.hexCode) params.set('hexCode', newFilters.hexCode);
        nextRouter.replace(`?${params.toString()}`);
        getColors(1, 10, newFilters);
    };

    // Cargar los filtros desde los search params al montar
    useEffect(() => {
        if (searchParams) {
            const name = searchParams.get('name') || '';
            const hexCode = searchParams.get('hexCode') || '';
            const loaded = { name, hexCode };
            setFilterValues(loaded);
            setFilters(loaded);
        }
    }, []);

    // Load colors when the component mounts or when the current page changes
    // This ensures that the colors are fetched from the store and displayed correctly.
    useEffect(() => {
        loadColors();
    }, [currentPage]);


    // Function to load colors from the store
    // It handles errors and displays a toast notification if loading fails.
    const loadColors = async () => {
        try {
            await getColors(currentPage, 10);
        } catch (error) {
            toast.error('Error al cargar los colores');
        }
    };


    // Function to handle page changes  
    // It calls the getColors function with the new page number and handles errors.
    const handlePageChange = async (page: number) => {
        try {
            await getColors(page, 10);
        } catch (error) {
            toast.error('Error al cambiar de página');
        }
    };


    // Function to handle the deletion of a color
    // It sets the colorIdToDelete state and opens the confirmation dialog.
    const handleDelete = async (id: number) => {
        try {
            await deleteColor(id);
            toast.success('Color eliminado exitosamente');
            await loadColors();
        } catch (error) {
            toast.error('Error al eliminar el color');
        }
    };


    // Function to open the confirmation dialog for deleting a color
    // It sets the colorIdToDelete state and opens the dialog.
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Breadcrumb>
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
                </div>
                <Button onClick={() => router.push('/colors/new')} className="bg-red-600 hover:bg-red-700">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Color
                </Button>
            </div>
            {/* Inputs de búsqueda mejorados */}
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full md:w-1/2">
                    <label htmlFor="name" className="font-medium text-sm min-w-[90px]">Nombre</label>
                    <Input
                        id="name"
                        placeholder="Nombre del color"
                        name="name"
                        value={filterValues.name}
                        onChange={handleFilterChange}
                        className="w-full"
                    />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 w-full md:w-1/2">
                    <label htmlFor="hexCode" className="font-medium text-sm min-w-[90px]">Código HEX</label>
                    <Input
                        id="hexCode"
                        placeholder="#FF0000"
                        name="hexCode"
                        value={filterValues.hexCode}
                        onChange={handleFilterChange}
                        className="w-full"
                    />
                </div>
            </div>
            <Card>
                <CardContent className="p-6">
                    <ColorTable
                        colors={colors}
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
                            Esta acción no se puede deshacer. Se eliminará permanentemente el color.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (colorIdToDelete !== null) {
                                    handleDelete(colorIdToDelete);
                                    setOpenDialog(false);
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

'use client'

import { IColorResponse } from '../../data/interfaces/color.interface'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, X, Palette } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ColorPagination } from './color-pagination'
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card'
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
} from "@/components/ui/alert-dialog"
import { useColorStore } from '../../context/color-store'
import { toast } from 'sonner'
import LoaderComponent from '@/shared/components/ui/Loader'

interface ColorTableProps {
    colors: IColorResponse[]
    onDelete: (id: number) => void
    loading: boolean
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function ColorTable({
    colors,
    onDelete,
    loading,
    currentPage,
    totalPages,
    onPageChange,
}: ColorTableProps) {
    const router = useRouter()
    const {
        filteredColors,
        searchTerm,
        setSearchTerm,
        clearFilters,
        getColors
    } = useColorStore()

    const handlePageChange = async (page: number) => {
        try {
            await getColors(page, 10);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    return (
        <Card className="w-full max-w-[1200px]">
            <CardHeader className="px-4 md:px-8 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
                        <Input
                            placeholder="Buscar por nombre, código HEX o descripción..."
                            className="w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                                className="h-10 w-10"
                                title="Limpiar filtros"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => router.push('/colors/new')}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Palette className="mr-2 h-4 w-4" />
                        Nuevo Color
                    </Button>
                </div>
                <hr className="border-t border-muted mt-4" />
            </CardHeader>

            <CardContent className="px-4 md:px-8">
                <div className="min-h-[400px] flex flex-col justify-between">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Código HEX</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead className="w-28 text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <LoaderComponent rows={5} columns={5} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredColors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Palette className="h-10 w-10 opacity-30" />
                                            <span>No hay colores para mostrar</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredColors.map((color) => (
                                    <TableRow key={color.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">{color.name}</TableCell>
                                        <TableCell>
                                            <div
                                                className="h-8 w-8 rounded-full border border-gray-300"
                                                style={{ backgroundColor: color.hexCode }}
                                            />
                                        </TableCell>
                                        <TableCell>{color.hexCode}</TableCell>
                                        <TableCell>{color.description}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/colors/edit/${color.id}`)}
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
                                                                Esta acción no se puede deshacer. Se eliminará permanentemente el color
                                                                <span className="font-semibold"> {color.name}</span> y todos sus datos asociados.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => onDelete(color.id)}
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
                    {!loading && filteredColors.length > 0 && (
                        <div className="mt-4">
                            <ColorPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

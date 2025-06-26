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
import { formatNullValue, capitalizeWords } from '@/lib/utils'

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
        <Card className="w-full">
            <CardHeader className="px-2 sm:px-4 md:px-8 pb-0">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto py-2 mb-4">
                        <Input
                            placeholder="Buscar por nombre, código HEX o descripción..."
                            className="w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                                className="h-10 w-10 cursor-pointer"
                                title="Limpiar filtros"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => router.push('/colors/new')}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                    >
                        <Palette className="mr-2 h-4 w-4" />
                        Nuevo Color
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
                                        <TableHead className="min-w-[150px] w-[25%]">Nombre</TableHead>
                                        <TableHead className="min-w-[80px] w-[10%]">Color</TableHead>
                                        <TableHead className="min-w-[100px] w-[15%]">Código HEX</TableHead>
                                        <TableHead className="min-w-[200px] w-[35%]">Descripción</TableHead>
                                        <TableHead className="min-w-[100px] w-[15%] text-center">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24">
                                                <LoaderComponent rows={5} columns={5} />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredColors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Palette className="h-10 w-10 opacity-30" />
                                                    <span>No hay colores para mostrar</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredColors.map((color) => (
                                            <TableRow key={color.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    {formatNullValue(capitalizeWords(color.name), "Sin nombre")}
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className="h-8 w-8 rounded-full border border-gray-300"
                                                        style={{ backgroundColor: color.hexCode }}
                                                    />
                                                </TableCell>
                                                <TableCell>{formatNullValue(color.hexCode, "Sin código")}</TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        <div
                                                            className="truncate"
                                                            title={color.description ? capitalizeWords(color.description) : "Sin descripción"}
                                                        >
                                                            {formatNullValue(capitalizeWords(color.description || ""), "Sin descripción")}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => router.push(`/colors/edit/${color.id}`)}
                                                            className="cursor-pointer"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta acción no se puede deshacer. Se eliminará permanentemente el color
                                                                        <span className="font-semibold"> {formatNullValue(capitalizeWords(color.name), "Sin nombre")}</span> y todos sus datos asociados.
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
                        </div>
                    </div>
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
    )
}

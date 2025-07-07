'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Package, X } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select';
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMaterialStore } from '@/features/materials/context/material-store';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { MaterialPaginator } from './material-paginator';
import LoaderComponent from '@/shared/components/ui/Loader';
import { formatNullValue, capitalizeWords } from '@/lib/utils';
import { MaterialTypes } from '../../data/schemas/material.schema';

// Definimos los tipos de material disponibles
const MaterialTypeLabels = {
    [MaterialTypes.CONSUMABLE]: "Consumible",
    [MaterialTypes.TOOL]: "Herramienta",
    [MaterialTypes.EQUIPMENT]: "Equipo",
    [MaterialTypes.METAL]: "Metal",
    [MaterialTypes.OTHER]: "Otro",
    [MaterialTypes.DELICATE]: "Delicado",
} as const;

// Mapeo de tipos del backend a tipos del frontend
const normalizeMaterialType = (type: string): string => {
    const normalized = type.toUpperCase().trim();

    // Mapeo de variaciones del backend
    const typeMapping: { [key: string]: string } = {
        'METAL': MaterialTypes.METAL,
        'OTRO': MaterialTypes.OTHER,
        'CONSUMABLE': MaterialTypes.CONSUMABLE,
        'TOOL': MaterialTypes.TOOL,
        'EQUIPMENT': MaterialTypes.EQUIPMENT,
        'DELICATE': MaterialTypes.DELICATE,
    };

    return typeMapping[normalized] || MaterialTypes.OTHER;
};

export default function MaterialTable() {
    const router = useRouter();
    const {
        materials,
        searchTerm,
        typeFilter,
        loading,
        getMaterials,
        deleteMaterial,
        currentPage,
        totalPages,
        setSearchTerm,
        setTypeFilter,
        clearFilters,
    } = useMaterialStore();

    const [materialToDelete, setMaterialToDelete] = useState<number | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                await getMaterials(currentPage, itemsPerPage);
            } catch (error) {
                console.error('Error loading materials:', error);
                toast.error('Error al cargar los materiales');
            }
        };

        loadMaterials();
    }, [getMaterials, currentPage]);

    const handleDelete = async () => {
        if (materialToDelete === null) return;

        try {
            await deleteMaterial(materialToDelete);
            toast.success('Material eliminado exitosamente');
            setMaterialToDelete(null);
        } catch (error) {
            console.error('Error deleting material:', error);
            toast.error('Error al eliminar el material');
        }
    };

    const getMaterialTypeBadge = (type: string) => {
        const normalizedType = normalizeMaterialType(type);
        const label = MaterialTypeLabels[normalizedType as keyof typeof MaterialTypeLabels] || type;

        return <Badge variant="outline">{label}</Badge>;
    };

    const handlePageChange = async (page: number) => {
        try {
            await getMaterials(page, itemsPerPage);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    return (
        <Card className="w-full mx-auto">
            <CardHeader className="px-4 md:px-8 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Input
                            placeholder="Buscar por nombre o descripción..."
                            className="w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Select
                            value={typeFilter}
                            onValueChange={setTypeFilter}
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Todos los tipos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                {Object.entries(MaterialTypeLabels).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(searchTerm || typeFilter !== 'all') && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 cursor-pointer"
                                onClick={clearFilters}
                                title="Limpiar todos los filtros"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button
                        onClick={() => router.push('/materials/new')}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nuevo Material
                    </Button>
                </div>
                <hr className="border-t border-muted mt-3" />
            </CardHeader>

            <CardContent className="px-4 md:px-8 pb-6">
                <div className="min-h-[400px] flex flex-col justify-between">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Nombre</TableHead>
                                    <TableHead className="w-[400px]">Descripción</TableHead>
                                    <TableHead className="w-[150px]">Tipo</TableHead>
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
                                ) : materials.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="py-20 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="h-10 w-10 opacity-30" />
                                                <span>No hay materiales para mostrar</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    materials.map((material) => (
                                        <TableRow key={material.id} className="h-16">
                                            <TableCell className="font-medium py-3">
                                                {formatNullValue(capitalizeWords(material.name), "Sin nombre")}
                                            </TableCell>
                                            <TableCell className="max-w-[400px] py-3">
                                                <div className="truncate" title={material.description}>
                                                    {formatNullValue(capitalizeWords(material.description), "Sin descripción")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">{getMaterialTypeBadge(material.materialType)}</TableCell>
                                            <TableCell className="text-right py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            router.push(`/materials/edit/${material.id}`);
                                                        }}
                                                        className="cursor-pointer h-8 w-8"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => setMaterialToDelete(material.id)}
                                                                className="cursor-pointer h-8 w-8"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción no se puede deshacer. Se eliminará permanentemente el material
                                                                    <span className="font-semibold"> {formatNullValue(capitalizeWords(material.name), "Sin nombre")}</span>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>
                                                                    Cancelar
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDelete}>
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
            </CardContent>

            <CardFooter className="flex items-center justify-center py-4">
                {!loading && materials.length > 0 && (
                    <MaterialPaginator
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </CardFooter>
        </Card>
    );
} 
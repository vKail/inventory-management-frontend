/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Package } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from '@/components/ui/card';
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMaterialStore } from '@/features/materials/context/material-store';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { MaterialPaginator } from './material-paginator';

export default function MaterialTable() {
    const router = useRouter();
    const {
        materials,
        loading,
        getMaterials,
        deleteMaterial,
        currentPage,
        totalPages
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
        const variants: { [key: string]: string } = {
            'CONSUMABLE': 'default',
            'TOOL': 'secondary',
            'EQUIPMENT': 'destructive'
        };
        const labels: { [key: string]: string } = {
            'CONSUMABLE': 'Consumible',
            'TOOL': 'Herramienta',
            'EQUIPMENT': 'Equipo'
        };
        return <Badge variant={variants[type] as "default" | "destructive" | "outline" | "secondary"}>{labels[type]}</Badge>;
    };

    const handlePageChange = (page: number) => {
        getMaterials(page, itemsPerPage);
    };

    return (
        <Card className="w-full max-w-[1200px]">
            <CardHeader className="px-4 md:px-8 pb-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
                        <Input
                            placeholder="Buscar por nombre..."
                            className="w-full md:w-64"
                        />
                    </div>

                    <Button
                        onClick={() => router.push('/materials/new')}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nuevo Material
                    </Button>
                </div>
                <hr className="border-t border-muted mt-4" />
            </CardHeader>

            <CardContent className="px-4 md:px-8 pb-6">
                <div className="min-h-[400px] flex flex-col justify-between">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        Cargando...
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
                                    <TableRow key={material.id}>
                                        <TableCell>{material.name}</TableCell>
                                        <TableCell>{material.description}</TableCell>
                                        <TableCell>{material.materialType}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    router.push(`/materials/edit/${material.id}`);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setMaterialToDelete(material.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente el material
                                                            <span className="font-semibold"> {material.name}</span>.
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
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-center py-4">
                <MaterialPaginator
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </CardFooter>
        </Card>
    );
} 
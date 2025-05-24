/* eslint-disable react/react-in-jsx-scope */
'use client';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Pencil, Trash2, Tags } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
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
import { useConditionStore } from '@/features/conditions/context/condition-store';
import { toast } from "sonner";

export default function ConditionTable() {
    const router = useRouter();
    const {
        conditions,
        loading,
        getConditions,
        deleteCondition
    } = useConditionStore();

    const [conditionToDelete, setConditionToDelete] = useState<string | null>(null);

    useEffect(() => {
        const loadConditions = async () => {
            try {
                await getConditions();
            } catch (error) {
                console.error('Error loading conditions:', error);
                toast.error('Error al cargar las condiciones');
            }
        };

        loadConditions();
    }, [getConditions]);

    const handleDelete = async () => {
        if (conditionToDelete === null) return;

        try {
            await deleteCondition(conditionToDelete);
            toast.success('Condición eliminada exitosamente');
            setConditionToDelete(null);
        } catch (error) {
            console.error('Error deleting condition:', error);
            toast.error('Error al eliminar la condición');
        }
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
                        onClick={() => router.push('/conditions/new')}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Condición
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
                                <TableHead>Requiere Mantenimiento</TableHead>
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
                            ) : conditions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-20 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Tags className="h-10 w-10 opacity-30" />
                                            <span>No hay condiciones para mostrar</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                conditions.map((condition) => (
                                    <TableRow key={condition.id}>
                                        <TableCell>{condition.name}</TableCell>
                                        <TableCell>{condition.description}</TableCell>
                                        <TableCell>{condition.requiresMaintenance ? 'Sí' : 'No'}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    router.push(`/conditions/edit/${condition.id}`);
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setConditionToDelete(condition.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Se eliminará permanentemente la condición
                                                            <span className="font-semibold"> {condition.name}</span>.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setConditionToDelete(null)}>
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
        </Card>
    );
} 
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
import { useEffect } from 'react';
import { useConditionStore } from '@/features/conditions/context/condition-store';
import { toast } from "sonner";
import { ConditionPagination } from './condition-pagination';
import LoaderComponent from '@/shared/components/ui/Loader';
import { formatNullValue, capitalizeWords, formatBooleanValue } from '@/lib/utils';

type StatusBadgeProps = {
    value: string | boolean;
    trueLabel?: string;
    falseLabel?: string;
    trueColor?: string;
    falseColor?: string;
    custom?: Record<string, { label: string; color: string }>;
};

function StatusBadge({ value, trueLabel = 'Sí', falseLabel = 'No', trueColor = 'bg-green-100 text-green-800', falseColor = 'bg-gray-100 text-gray-800', custom = {} }: StatusBadgeProps) {
    let label = value ? trueLabel : falseLabel;
    let color = value ? trueColor : falseColor;
    if (typeof value === 'string' && custom && custom[value]) {
        label = custom[value].label;
        color = custom[value].color;
    }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{label}</span>
    );
}

export default function ConditionTable() {
    const router = useRouter();
    const {
        conditions,
        filteredConditions,
        searchTerm,
        setSearchTerm,
        loading,
        getConditions,
        deleteCondition,
        currentPage,
        totalPages
    } = useConditionStore();

    const itemsPerPage = 10;

    useEffect(() => {
        loadConditions();
    }, [currentPage]);

    const loadConditions = async () => {
        try {
            await getConditions(currentPage, itemsPerPage);
        } catch (error) {
            console.error('Error loading conditions:', error);
            toast.error('Error al cargar las condiciones');
        }
    };

    const handlePageChange = async (page: number) => {
        try {
            await getConditions(page, itemsPerPage);
        } catch (error) {
            console.error('Error changing page:', error);
            toast.error('Error al cambiar de página');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteCondition(id);
            toast.success('Condición eliminada exitosamente');
            loadConditions();
        } catch (error) {
            console.error('Error deleting condition:', error);
            toast.error('Error al eliminar la condición');
        }
    };

    return (
        <Card className="w-full">
            <CardHeader className="px-2 sm:px-4 md:px-8 pb-0">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        <Input
                            placeholder="Buscar por nombre..."
                            className="w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <Button
                        onClick={() => router.push('/conditions/new')}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Condición
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
                                        <TableHead className="min-w-[200px] w-[45%]">Descripción</TableHead>
                                        <TableHead className="min-w-[150px] w-[20%]">Requiere Mantenimiento</TableHead>
                                        <TableHead className="min-w-[100px] w-[10%] text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24">
                                                <LoaderComponent rows={5} columns={4} />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredConditions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Tags className="h-10 w-10 opacity-30" />
                                                    <span>No hay condiciones para mostrar</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredConditions.map((condition) => (
                                            <TableRow key={condition.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    {formatNullValue(capitalizeWords(condition.name), "Sin nombre")}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        <div
                                                            className="truncate"
                                                            title={condition.description ? capitalizeWords(condition.description) : "Sin descripción"}
                                                        >
                                                            {formatNullValue(capitalizeWords(condition.description), "Sin descripción")}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge
                                                        value={condition.requiresMaintenance}
                                                        trueLabel="Sí"
                                                        falseLabel="No"
                                                        trueColor="bg-green-100 text-green-800"
                                                        falseColor="bg-gray-100 text-gray-800"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                router.push(`/conditions/edit/${condition.id}`);
                                                            }}
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
                                                                        Esta acción no se puede deshacer. Se eliminará permanentemente la condición
                                                                        <span className="font-semibold"> {formatNullValue(capitalizeWords(condition.name), "Sin nombre")}</span>.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => condition.id && handleDelete(condition.id)}
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
                    {!loading && filteredConditions.length > 0 && (
                        <div className="mt-4">
                            <ConditionPagination
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
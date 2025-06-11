'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { useItemTypeStore } from '../../context/item-types-store';
import LoaderComponent from '@/shared/components/ui/Loader';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';

export default function ItemTypeTable() {
    const router = useRouter();
    const {
        itemTypes,
        filteredItemTypes,
        searchTerm,
        setSearchTerm,
        loading,
        getItemTypes,
        deleteItemType,
        currentPage,
        totalPages
    } = useItemTypeStore();

    const [itemTypeToDelete, setItemTypeToDelete] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadItemTypes = async () => {
            try {
                await getItemTypes(currentPage, itemsPerPage);
            } catch (error) {
                console.error('Error loading item types:', error);
                toast.error('Error al cargar los tipos de item');
            }
        };

        loadItemTypes();
    }, [getItemTypes, currentPage]);

    const handleDelete = (id: string) => {
        const toastId = toast('¿Deseas eliminar este tipo de item?', {
            action: {
                label: 'Eliminar',
                onClick: async () => {
                    try {
                        await deleteItemType(id);
                        toast.success('Tipo de item eliminado exitosamente');
                    } catch (error) {
                        console.error('Error deleting item type:', error);
                        toast.error('Error al eliminar el tipo de item');
                    } finally {
                        toast.dismiss(toastId);
                    }
                },
            },
            cancel: {
                label: 'Cancelar',
                onClick: () => {
                    toast.dismiss(toastId);
                },
            },
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto py-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Tipos de Item</CardTitle>
                        <Button onClick={() => router.push('/item-types/new')}>
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Tipo
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <LoaderComponent rows={5} columns={5} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            {/* Breadcrumbs, título y descripción */}
            <div className="w-full">
                <Breadcrumb className="mb-6">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <span className="text-muted-foreground font-medium">Configuración</span>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Wrench className="inline mr-1 h-4 w-4 text-primary align-middle" />
                            <BreadcrumbLink href="/item-types">Tipos de Item</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">Tipos de Item</CardTitle>
                    <Button onClick={() => router.push('/item-types/new')}>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Tipo
                    </Button>

                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4 w-full md:w-1/3"
                    />
                    <Table>

                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItemTypes.map((itemType) => (
                                <TableRow key={itemType.id}>
                                    <TableCell className="font-medium">{itemType.code}</TableCell>
                                    <TableCell>{itemType.name}</TableCell>
                                    <TableCell>{itemType.description}</TableCell>
                                    <TableCell>
                                        <Badge variant={itemType.active ? "default" : "secondary"}>
                                            {itemType.active ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => router.push(`/item-types/edit/${itemType.id}`)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleDelete(itemType.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
} 
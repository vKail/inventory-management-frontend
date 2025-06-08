"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "../../context/inventory-store";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { InventoryTable } from "../components/inventory-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoaderComponent from '@/shared/components/ui/Loader';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";

export const InventoryView = () => {
    const router = useRouter();
    const { getInventoryItems, items, loading, error, totalPages, currentPage, isEmpty } = useInventoryStore();

    useEffect(() => {
        getInventoryItems(currentPage);
    }, [currentPage, getInventoryItems]);

    const handlePageChange = (page: number) => {
        getInventoryItems(page);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (isEmpty) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Inventario</h1>
                    <Button onClick={() => router.push("/inventory/new")}>
                        Crear Nuevo Item
                    </Button>
                </div>
                <EmptyState
                    title="No hay items en el inventario"
                    description="¿Deseas crear el primer item?"
                    action={
                        <Button onClick={() => router.push("/inventory/new")}>
                            Crear Item
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Inventario</h1>
                <Button onClick={() => router.push("/inventory/new")}>
                    Crear Nuevo Item
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Última Actualización</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.code}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.stock}</TableCell>
                                <TableCell>
                                    <Badge>{item.statusId}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.normativeType}</Badge>
                                </TableCell>
                                <TableCell>
                                    {format(new Date(item.updatedAt), "PPP", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/inventory/${item.id}`)}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/inventory/${item.id}/edit`)}
                                        >
                                            Editar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}; 
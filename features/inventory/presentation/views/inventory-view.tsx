"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "../../context/inventory-store";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { InventoryTable } from "../components/inventory-table";

export const InventoryView = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { getInventoryItems, loading } = useInventoryStore();

    useEffect(() => {
        getInventoryItems(currentPage);
    }, [currentPage, getInventoryItems]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">Inventario</h1>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Inventario</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Buscar items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[300px]"
                    />
                    <Button onClick={() => router.push("/inventory/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nuevo Item
                    </Button>
                </div>
            </div>

            <InventoryTable
                currentPage={currentPage}
                itemsPerPage={10}
                onPageChange={handlePageChange}
                searchTerm={searchTerm}
            />
        </div>
    );
}; 
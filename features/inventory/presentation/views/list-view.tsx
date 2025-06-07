"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useInventoryStore } from "../../context/inventory-store";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../components/columns";
import { LoaderComponent } from "@/components/ui/loader";

export const ListView = () => {
    const router = useRouter();
    const { items, loading, getInventoryItems } = useInventoryStore();

    useEffect(() => {
        getInventoryItems();
    }, [getInventoryItems]);

    if (loading) {
        return <LoaderComponent rows={5} columns={7} />;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Inventario</h2>
                <Button onClick={() => router.push("/inventory/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Producto
                </Button>
            </div>
            <DataTable columns={columns} data={items} />
        </div>
    );
}; 
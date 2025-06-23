"use client"

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { InventoryForm } from "@/features/inventory/presentation/components/inventory-form";
import { useParams } from "next/navigation";
import { InventoryItem, InventoryFormData } from "@/features/inventory/data/interfaces/inventory.interface";

// Function to convert InventoryItem to InventoryFormData format
const convertItemToFormData = (item: InventoryItem): Partial<InventoryFormData> => {
    return {
        ...item,
        warrantyDate: item.warrantyDate ? new Date(item.warrantyDate) : undefined,
        expirationDate: item.expirationDate ? new Date(item.expirationDate) : undefined,
    };
};

export default function EditInventoryPage() {
    const { id } = useParams();
    const { getInventoryItem } = useInventoryStore();
    const [item, setItem] = useState<InventoryItem | undefined>();

    useEffect(() => {
        const fetchItem = async () => {
            if (id) {
                const fetchedItem = await getInventoryItem(id.toString());
                setItem(fetchedItem);
            }
        };
        fetchItem();
    }, [id, getInventoryItem]);

    if (!item) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-8">Editar Item</h1>
            <InventoryForm mode="edit" initialData={convertItemToFormData(item)} />
        </div>
    );
} 
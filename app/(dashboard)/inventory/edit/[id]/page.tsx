"use client"

import { useEffect, useState, useCallback } from "react";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { InventoryForm } from "@/features/inventory/presentation/components/inventory-form";
import { useParams } from "next/navigation";
import { InventoryItem, InventoryFormData, ItemMaterial, ItemColor } from "@/features/inventory/data/interfaces/inventory.interface";
import { ItemMaterialService } from "@/features/inventory/services/item-material.service";
import { ItemColorService } from "@/features/inventory/services/item-color.service";
import InventoryFormView from '@/features/inventory/presentation/views/inventory-form-view';

// Function to convert InventoryItem to InventoryFormData format
const convertItemToFormData = (item: InventoryItem): Partial<InventoryFormData> => {
    return {
        ...item,
        warrantyDate: item.warrantyDate ? new Date(item.warrantyDate) : undefined,
        expirationDate: item.expirationDate ? new Date(item.expirationDate) : undefined,
    };
};

export default function EditInventoryPage() {
    return (
        <div className="container mx-auto py-8">

            <InventoryFormView />
        </div>
    );
} 
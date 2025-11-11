import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { InventoryItem } from '@/features/inventory/data/interfaces/inventory.interface';
import { useConditionStore } from '@/features/conditions/context/condition-store';
import { useInventoryStore } from '@/features/inventory/context/inventory-store';

export interface ScannedItem {
    id: number; // ID real del item en la base de datos
    code: string;
    name: string;
    characteristics: string;
    image: string | null;
    exitObservations: string;
    conditionId?: string;
    exitConditionId?: string;
    quantity: number;
    stock: number;
}

export const useScannedItems = () => {
    const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
    const { getConditionById, conditions } = useConditionStore();
    const { getInventoryItemByCode } = useInventoryStore();

    const addScannedItem = useCallback(async (item: InventoryItem | null) => {
        if (!item) return null;

        // Check if item is already in the list
        if (scannedItems.some(i => i.code === item.code)) {
            toast.error("Este item ya ha sido agregado");
            return null;
        }

        // Check availability
        if (!item.availableForLoan) {
            toast.error("Este item no está disponible para préstamo");
            return null;
        }

        let conditionId = item.conditionId?.toString();
        let conditionName = "No especificada";

        if (item.conditionId) {
            const condition = await getConditionById(item.conditionId.toString());
            if (condition) {
                conditionName = condition.name;
            } else if (conditions.length > 0) {
                conditionId = conditions[0].id.toString();
                conditionName = conditions[0].name;
                toast.warning(`La condición con id ${item.conditionId} no fue encontrada. Se ha establecido la condición "${conditionName}" por defecto.`);
            }
        } else if (conditions.length > 0) {
            conditionId = conditions[0].id.toString();
            conditionName = conditions[0].name;
        }

        const newItem: ScannedItem = {
            id: Number(item.id), // Guardar el ID real del item
            code: item.code,
            name: item.name,
            characteristics: item.modelCharacteristics || "",
            image: item.images?.[0]?.filePath || null,
            exitObservations: "",
            conditionId: conditionId,
            exitConditionId: conditionId,
            quantity: 1,
            stock: item.stock
        };

        setScannedItems(prev => [...prev, newItem]);

        return {
            itemId: Number(item.id),
            exitConditionId: Number(conditionId) || 0,
            exitObservations: "",
            quantity: 1
        };
    }, [scannedItems, getConditionById, conditions]);

    const removeScannedItem = useCallback((code: string) => {
        setScannedItems(prev => prev.filter(item => item.code !== code));
    }, []);

    const updateItemObservations = useCallback((code: string, observations: string) => {
        setScannedItems(prev =>
            prev.map(item =>
                item.code === code ? { ...item, exitObservations: observations } : item
            )
        );
    }, []);

    const updateItemCondition = useCallback((itemCode: string, conditionId: string | number) => {
        const conditionIdStr = conditionId.toString();
        setScannedItems(prev =>
            prev.map(item =>
                item.code === itemCode ? { ...item, exitConditionId: conditionIdStr } : item
            )
        );
    }, []);

    const updateItemQuantity = useCallback((itemCode: string, quantity: number) => {
        const item = scannedItems.find(i => i.code === itemCode);
        if (!item) return;

        // Validate stock limit (max 7 digits)
        if (quantity > 9999999) {
            toast.error("La cantidad no puede exceder 9,999,999");
            return;
        }

        // Validate against available stock
        if (quantity > item.stock) {
            toast.error(`La cantidad no puede exceder el stock disponible (${item.stock})`);
            return;
        }

        // Ensure minimum quantity
        if (quantity < 1) {
            quantity = 1;
        }

        setScannedItems(prev =>
            prev.map(item =>
                item.code === itemCode ? { ...item, quantity } : item
            )
        );
    }, [scannedItems]);

    const refreshItemsStock = useCallback(async () => {
        const refreshedItems = await Promise.all(
            scannedItems.map(async (item) => {
                const inventoryItem = await getInventoryItemByCode(item.code);
                return {
                    ...item,
                    id: inventoryItem?.id ? Number(inventoryItem.id) : item.id, // Actualizar el ID también
                    stock: inventoryItem?.stock ?? item.stock,
                };
            })
        );
        setScannedItems(refreshedItems);
        return refreshedItems;
    }, [scannedItems, getInventoryItemByCode]);

    return {
        scannedItems,
        addScannedItem,
        removeScannedItem,
        updateItemObservations,
        updateItemCondition,
        updateItemQuantity,
        refreshItemsStock
    };
};

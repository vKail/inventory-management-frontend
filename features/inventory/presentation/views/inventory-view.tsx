"use client";

import { useEffect } from "react";
import { useInventoryStore } from "../../context/inventory-store";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { InventoryHeader } from "../components/inventory-header";
import { InventoryTableView } from "../components/inventory-table-view";
import { InventoryGridView } from "../components/inventory-grid-view";
import { InventoryListView } from "../components/inventory-list-view";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useStateStore } from "@/features/states/context/state-store";

type ViewType = 'table' | 'grid' | 'list';

export const InventoryView = () => {
    const router = useRouter();
    const { getInventoryItems, loading, items, filters, setFilters } = useInventoryStore();
    const { getCategories } = useCategoryStore();
    const { getItemTypes } = useItemTypeStore();
    const { getStates } = useStateStore();

    useEffect(() => {
        getInventoryItems();
        getCategories();
        getItemTypes();
        getStates();
    }, [getInventoryItems, getCategories, getItemTypes, getStates]);

    const handleItemClick = (item: InventoryItem) => {
        router.push(`/inventory/edit/${item.id}`);
    };

    const handleViewChange = (view: ViewType) => {
        setFilters({ ...filters, view });
    };

    const currentView = (filters as any).view || 'table';

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-1 mb-8">
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

            <div className="flex flex-col h-full">
                <InventoryHeader
                    onViewChange={handleViewChange}
                    currentView={currentView}
                />

                <div className="flex-1 overflow-auto">
                    {currentView === 'table' && (
                        <InventoryTableView
                            items={items || []}
                            onItemClick={handleItemClick}
                        />
                    )}
                    {currentView === 'grid' && (
                        <InventoryGridView
                            items={items || []}
                            onItemClick={handleItemClick}
                        />
                    )}
                    {currentView === 'list' && (
                        <InventoryListView
                            items={items || []}
                            onItemClick={handleItemClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}; 
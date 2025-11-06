import { Search, ArrowDownUp, List, Grid2X2, Plus, Barcode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useLocationStore } from "@/features/locations/context/location-store";
import { useInventoryStore } from "../../context/inventory-store";
import { useCallback, useEffect, useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { CustomizableFilterBar } from "@/components/ui/customizable-filter-bar";
import { useUserStore } from "@/features/users/context/user-store";
import { useConditionStore } from "@/features/conditions/context/condition-store";

interface InventoryHeaderProps {
    onViewChange: (view: 'table' | 'grid' | 'list') => void;
    currentView: 'table' | 'grid' | 'list';
}

export function InventoryHeader({
    onViewChange,
    currentView,
}: InventoryHeaderProps) {
    const router = useRouter();
    const { categories, getCategories } = useCategoryStore();
    const { itemTypes, getItemTypes } = useItemTypeStore();
    const { locations, getLocations } = useLocationStore();
    const { setFilters, getInventoryItemByCode, clearFilters, filters } = useInventoryStore();
    const { users } = useUserStore();
    const { conditions } = useConditionStore();
    // Prepare condition options
    const conditionOptions = conditions.map(c => ({ value: String(c.id), label: c.name }));
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);

    useEffect(() => {
        getCategories();
        getItemTypes();
        // Get full locations list for filter dropdowns
        getLocations(1, 10, '', 'all', true);
    }, [getCategories, getItemTypes, getLocations]);

    const handleSearch = useCallback((value: string) => {
        setFilters({ search: value });
    }, [setFilters]);

    // Prepare custodian options from active users
    const custodianOptions = users
        .filter(u => u.status === 'ACTIVE')
        .map(u => ({ value: String(u.id), label: u.userName || (u.person?.firstName + ' ' + u.person?.lastName) }));

    // Prepare availableOptions for all possible filters
    const availableOptions = {
        categoryId: [
            { value: 'all', label: 'Todas las categorías' },
            ...categories.map((category) => ({ value: category.id.toString(), label: category.name }))
        ],
        locationId: [
            { value: 'all', label: 'Todas las ubicaciones' },
            ...locations
                .filter((location) => typeof location.id === 'string' || typeof location.id === 'number')
                .map((location) => ({ value: String(location.id), label: location.name }))
        ],
        itemTypeId: [
            { value: 'all', label: 'Todos los tipos' },
            ...itemTypes.map((type) => ({ value: type.id.toString(), label: type.name }))
        ],
        statusId: [],
        conditionId: [
            { value: 'all', label: 'Todas las condiciones' },
            ...conditionOptions
        ],
        custodianId: [
            { value: 'all', label: 'Todos los custodios' },
            ...custodianOptions
        ],
        normativeType: [
            { value: 'PROPERTY', label: 'Propiedad' },
            { value: 'ADMINISTRATIVE_CONTROL', label: 'Control Administrativo' },
            { value: 'INVENTORY', label: 'Inventario' }
        ],
        entryOrigin: [
            { value: 'PURCHASE', label: 'Compra' },
            { value: 'LOAN', label: 'Préstamo' }
        ],
    };

    const handleScan = () => {
        setIsScanModalOpen(true);
    };

    const handleScanComplete = (item: InventoryItem | null) => {
        if (item) {
            setScannedItem(item);
        }
    };

    const hasActiveFilters = filters.search ||
        (filters.categoryId && filters.categoryId !== 'all') ||
        (filters.locationId && filters.locationId !== 'all') ||
        (filters.itemTypeId && filters.itemTypeId !== 'all');

    // Convert filters to Record<string, string> for CustomizableFilterBar
    const stringFilters: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
        stringFilters[k] = v == null ? '' : String(v);
    });

    // Ensure hasActiveFilters is boolean
    const hasActiveFiltersBool = Boolean(hasActiveFilters);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar items..."
                            className="pl-8"
                            onChange={(e) => handleSearch(e.target.value)}
                            value={filters.search || ''}
                        />
                    </div>
                    <div className="flex-1">
                        <CustomizableFilterBar
                            availableOptions={availableOptions}
                            filters={stringFilters}
                            onChange={setFilters}
                            onClearFilters={clearFilters}
                            hasActiveFilters={hasActiveFiltersBool}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="border rounded-md flex">
                        <Button
                            variant={currentView === 'table' ? 'default' : 'ghost'}
                            size="icon"
                            className="rounded-r-none"
                            onClick={() => onViewChange('table')}
                        >
                            <ArrowDownUp className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={currentView === 'list' ? 'default' : 'ghost'}
                            size="icon"
                            className="rounded-none"
                            onClick={() => onViewChange('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={currentView === 'grid' ? 'default' : 'ghost'}
                            size="icon"
                            className="rounded-l-none"
                            onClick={() => onViewChange('grid')}
                        >
                            <Grid2X2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleScan}
                        className="flex items-center gap-2"
                    >
                        <Barcode className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => router.push('/inventory/new')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Registrar Producto</span>
                    </Button>
                </div>
            </div>
            <hr className="border-t border-muted" />
            <ScanProcessModal
                isOpen={isScanModalOpen}
                onClose={() => {
                    setIsScanModalOpen(false);
                    setScannedItem(null);
                }}
                onScanComplete={handleScanComplete}
            />
        </div>
    );
} 
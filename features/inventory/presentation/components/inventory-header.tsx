import { Search, ArrowDownUp, List, Grid2X2, Plus, Barcode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/features/categories/context/category-store";
import { useItemTypeStore } from "@/features/item-types/context/item-types-store";
import { useLocationStore } from "@/features/locations/context/location-store";
import { Combobox } from "@/components/ui/combobox";
import { useInventoryStore } from "../../context/inventory-store";
import { useCallback, useEffect, useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";
import { InventoryItem } from "../../data/interfaces/inventory.interface";

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
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);

    useEffect(() => {
        getCategories();
        getItemTypes();
        getLocations();
    }, [getCategories, getItemTypes, getLocations]);

    const handleSearch = useCallback((value: string) => {
        setFilters({ search: value });
    }, [setFilters]);

    const handleCategoryChange = useCallback((value: string | number) => {
        setFilters({ categoryId: value.toString() });
    }, [setFilters]);

    const handleLocationChange = useCallback((value: string | number) => {
        setFilters({ locationId: value === 'all' ? undefined : value });
    }, [setFilters]);

    const handleTypeChange = useCallback((value: string | number) => {
        setFilters({ itemTypeId: value.toString() });
    }, [setFilters]);

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

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar items..."
                            className="pl-8"
                            onChange={(e) => handleSearch(e.target.value)}
                            value={filters.search || ''}
                        />
                    </div>

                    <div className="min-w-[120px] flex-1 max-w-[200px]">
                        <Combobox
                            options={[
                                { value: 'all', label: 'Todas las categorías' },
                                ...categories.map((category) => ({ value: category.id.toString(), label: category.name }))
                            ]}
                            value={filters.categoryId?.toString() || 'all'}
                            onChange={handleCategoryChange}
                            placeholder="Categoría"
                            searchPlaceholder="Buscar categoría..."
                            emptyMessage="No se encontraron categorías"
                        />
                    </div>

                    <div className="min-w-[120px] flex-1 max-w-[200px]">
                        <Combobox
                            options={[
                                { value: 'all', label: 'Todas las ubicaciones' },
                                ...locations
                                    .filter((location) => typeof location.id === 'string' || typeof location.id === 'number')
                                    .map((location) => ({ value: String(location.id), label: location.name }))
                            ]}
                            value={filters.locationId?.toString() || 'all'}
                            onChange={handleLocationChange}
                            placeholder="Ubicación"
                            searchPlaceholder="Buscar ubicación..."
                            emptyMessage="No se encontraron ubicaciones"
                        />
                    </div>

                    <div className="min-w-[120px] flex-1 max-w-[200px]">
                        <Combobox
                            options={[
                                { value: 'all', label: 'Todos los tipos' },
                                ...itemTypes.map((type) => ({ value: type.id.toString(), label: type.name }))
                            ]}
                            value={filters.itemTypeId?.toString() || 'all'}
                            onChange={handleTypeChange}
                            placeholder="Tipo"
                            searchPlaceholder="Buscar tipo..."
                            emptyMessage="No se encontraron tipos"
                        />
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={clearFilters}
                            className="h-10 w-10 cursor-pointer"
                            title="Limpiar filtros"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
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
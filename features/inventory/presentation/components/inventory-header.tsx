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
import { useStateStore } from "@/features/states/context/state-store";
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
    const { states, getStates } = useStateStore();
    const { setFilters, getInventoryItemByCode, clearFilters, filters } = useInventoryStore();
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);
    const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);

    useEffect(() => {
        getCategories();
        getItemTypes();
        getStates();
    }, [getCategories, getItemTypes, getStates]);

    const handleSearch = useCallback((value: string) => {
        setFilters({ search: value });
    }, [setFilters]);

    const handleCategoryChange = useCallback((value: string) => {
        setFilters({ categoryId: value });
    }, [setFilters]);

    const handleStateChange = useCallback((value: string) => {
        setFilters({ statusId: value });
    }, [setFilters]);

    const handleTypeChange = useCallback((value: string) => {
        setFilters({ itemTypeId: value });
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
        (filters.statusId && filters.statusId !== 'all') ||
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

                    <Select onValueChange={handleCategoryChange} value={filters.categoryId || 'all'}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={handleStateChange} value={filters.statusId || 'all'}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            {states.map((state) => (
                                <SelectItem key={state.id} value={state.id.toString()}>
                                    {state.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={handleTypeChange} value={filters.itemTypeId || 'all'}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los tipos</SelectItem>
                            {itemTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

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
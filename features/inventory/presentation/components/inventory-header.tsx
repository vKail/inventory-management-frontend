import { Search, ArrowDownUp, List, Grid2X2, Plus } from "lucide-react";
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
import { useCallback, useEffect } from "react";

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
    const { setFilters } = useInventoryStore();

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

    return (
        <div className="flex flex-col space-y-1.5 p-6 px-4 md:px-8 pb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar producto..."
                                className="pl-9"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>

                        <Select onValueChange={handleCategoryChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las categorías</SelectItem>
                                {categories?.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleStateChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {states?.map((state) => (
                                    <SelectItem key={state.id} value={state.id.toString()}>
                                        {state.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select onValueChange={handleTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos los tipos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                {itemTypes?.map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                        onClick={() => router.push('/inventory/new')}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Registrar Producto</span>
                    </Button>
                </div>
            </div>
            <hr className="border-t border-muted" />
        </div>
    );
} 
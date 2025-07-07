import { ArrowDownUp, List, Grid2X2, Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLoanStore } from "../../context/loan-store";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface LoanHeaderProps {
    onViewChange: (view: 'table' | 'grid' | 'list') => void;
    currentView: 'table' | 'grid' | 'list';
}

const LOAN_STATUSES = {
    DELIVERED: "Entregado",
    RETURNED: "Devuelto",
    CANCELLED: "Cancelado",
    RETURNED_LATE: "Devuelto Tardíamente"
} as const;

const DATE_RANGES = [
    { value: "all", label: "Todos" },
    { value: "7days", label: "Últimos 7 días" },
    { value: "1month", label: "Último mes" },
    { value: "6months", label: "Últimos 6 meses" },
    { value: "1year", label: "Último año" }
];

const FUTURE_DUE_DATE_RANGES = [
    { value: "next7days", label: "Próximos 7 días" },
    { value: "next1month", label: "Próximo mes" },
    { value: "next6months", label: "Próximos 6 meses" },
    { value: "next1year", label: "Próximo año" }
];

export function LoanHeader({
    onViewChange,
    currentView,
}: LoanHeaderProps) {
    const router = useRouter();
    const { setFilters, filters, clearFilters } = useLoanStore();
    const [dniInput, setDniInput] = useState(filters.requestorDni || '');

    const handleDeliveryDateRangeChange = useCallback((value: string) => {
        setFilters({ deliveryDateRange: value });
    }, [setFilters]);

    const handleDueDateRangeChange = useCallback((value: string) => {
        setFilters({ dueDateRange: value });
    }, [setFilters]);

    const handleStatusChange = useCallback((value: string) => {
        setFilters({ status: value });
    }, [setFilters]);

    const handleNewLoan = () => {
        router.push('/loans/new');
    };

    const handleDniSearch = useCallback(() => {
        setFilters({ requestorDni: dniInput.trim() });
    }, [setFilters, dniInput]);

    const handleClearDni = useCallback(() => {
        setDniInput('');
        setFilters({ requestorDni: '' });
    }, [setFilters]);

    const hasActiveFilters = filters.deliveryDateRange !== 'all' ||
        filters.dueDateRange !== 'all' ||
        (filters.status && filters.status !== 'all') ||
        (filters.requestorDni && filters.requestorDni.trim());

    return (
        <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {filters.requestorDni && filters.requestorDni.trim() && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-2 mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            <span className="text-sm font-medium text-red-900">
                                Mostrando historial de préstamos para DNI: <span className="font-bold">{filters.requestorDni}</span>
                            </span>
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto py-1 mb-2 items-end overflow-x-auto">
                    <div className="relative max-w-xs w-full">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Filtrar por Fecha de Entrega</label>
                        <Select
                            onValueChange={handleDeliveryDateRangeChange}
                            defaultValue={filters.deliveryDateRange}
                        >
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Filtrar por Fecha de Entrega" />
                            </SelectTrigger>
                            <SelectContent>
                                {DATE_RANGES.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Filtrar por Fecha de Vencimiento</label>
                        <Select
                            onValueChange={handleDueDateRangeChange}
                            defaultValue={filters.dueDateRange}
                        >
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Filtrar por Fecha de Vencimiento" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="px-2 py-1 text-xs text-muted-foreground">Fechas Pasadas</div>
                                {DATE_RANGES.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                                <div className="px-2 py-1 text-xs text-muted-foreground">Fechas Futuras</div>
                                {FUTURE_DUE_DATE_RANGES.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Estado</label>
                        <Select
                            onValueChange={handleStatusChange}
                            defaultValue={filters.status}
                        >
                            <SelectTrigger className="w-full max-w-xs">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {Object.entries(LOAN_STATUSES).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="relative max-w-xs w-full">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">Buscar por DNI</label>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Ej: 1804908471"
                                value={dniInput}
                                onChange={(e) => {
                                    // Only allow numbers
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setDniInput(value);
                                }}
                                className="w-full max-w-[120px]"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleDniSearch();
                                    }
                                }}
                                maxLength={10}
                            />
                            <Button
                                onClick={handleDniSearch}
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                                disabled={!dniInput.trim() || dniInput.length < 10}
                                title={dniInput.length < 10 ? "DNI debe tener al menos 10 dígitos" : "Buscar préstamos"}
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                            {filters.requestorDni && filters.requestorDni.trim() && (
                                <Button
                                    onClick={handleClearDni}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    title="Limpiar filtro DNI"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        {dniInput && dniInput.length < 8 && (
                            <p className="text-xs text-orange-600 mt-1">DNI debe tener al menos 10 dígitos</p>
                        )}
                    </div>

                    {hasActiveFilters && (
                        <div className="flex sm:items-end">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                                className="h-10 w-10 cursor-pointer mb-0 sm:mb-1"
                                title="Limpiar filtros"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
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
                        onClick={handleNewLoan}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nuevo Préstamo</span>
                    </Button>
                </div>
            </div>
            <hr className="border-t border-muted mt-2" />
        </div>
    );
} 
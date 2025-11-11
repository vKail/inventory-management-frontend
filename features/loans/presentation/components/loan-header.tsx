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
        <div className="space-y-3">
            {/* DNI Filter Alert */}
            {filters.requestorDni && filters.requestorDni.trim() && (
                <div className="w-full bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm font-medium text-red-900">
                            Mostrando historial de préstamos para DNI: <span className="font-bold">{filters.requestorDni}</span>
                        </span>
                    </div>
                </div>
            )}

            {/* Filters and Actions Row */}
            <div className="flex flex-col gap-3">
                {/* Filters Section - Wrap on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {/* Delivery Date Filter */}
                    <div className="relative w-full">
                        <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">Fecha de Entrega</label>
                        <Select
                            onValueChange={handleDeliveryDateRangeChange}
                            defaultValue={filters.deliveryDateRange}
                        >
                            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
                                <SelectValue placeholder="Filtrar por Fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                {DATE_RANGES.map(({ value, label }) => (
                                    <SelectItem key={value} value={value} className="text-xs sm:text-sm">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Due Date Filter */}
                    <div className="relative w-full">
                        <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">Fecha de Vencimiento</label>
                        <Select
                            onValueChange={handleDueDateRangeChange}
                            defaultValue={filters.dueDateRange}
                        >
                            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
                                <SelectValue placeholder="Filtrar por Vencimiento" />
                            </SelectTrigger>
                            <SelectContent>
                                <div className="px-2 py-1 text-[10px] sm:text-xs text-muted-foreground font-medium">Fechas Pasadas</div>
                                {DATE_RANGES.map(({ value, label }) => (
                                    <SelectItem key={value} value={value} className="text-xs sm:text-sm">
                                        {label}
                                    </SelectItem>
                                ))}
                                <div className="px-2 py-1 text-[10px] sm:text-xs text-muted-foreground font-medium">Fechas Futuras</div>
                                {FUTURE_DUE_DATE_RANGES.map(({ value, label }) => (
                                    <SelectItem key={value} value={value} className="text-xs sm:text-sm">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="relative w-full">
                        <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">Estado</label>
                        <Select
                            onValueChange={handleStatusChange}
                            defaultValue={filters.status}
                        >
                            <SelectTrigger className="w-full h-9 text-xs sm:text-sm">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="text-xs sm:text-sm">Todos</SelectItem>
                                {Object.entries(LOAN_STATUSES).map(([value, label]) => (
                                    <SelectItem key={value} value={value} className="text-xs sm:text-sm">
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* DNI Search */}
                    <div className="relative w-full">
                        <label className="block text-[10px] sm:text-xs font-medium text-muted-foreground mb-1">Buscar por DNI</label>
                        <div className="flex gap-1.5">
                            <Input
                                type="text"
                                placeholder="1234567890"
                                value={dniInput}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                    setDniInput(value);
                                }}
                                className="w-full h-9 text-xs sm:text-sm"
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
                                className="bg-red-600 hover:bg-red-700 h-9 px-2.5 sm:px-3 flex-shrink-0"
                                disabled={!dniInput.trim() || dniInput.length < 10}
                                title={dniInput.length < 10 ? "DNI debe tener 10 dígitos" : "Buscar"}
                            >
                                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            {filters.requestorDni && filters.requestorDni.trim() && (
                                <Button
                                    onClick={handleClearDni}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 h-9 px-2.5 sm:px-3 flex-shrink-0"
                                    title="Limpiar"
                                >
                                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                            )}
                        </div>
                        {dniInput && dniInput.length < 10 && dniInput.length > 0 && (
                            <p className="text-[10px] text-orange-600 mt-0.5">Mínimo 10 dígitos</p>
                        )}
                    </div>
                </div>

                {/* View Toggle and Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="h-9 px-3 text-xs"
                                title="Limpiar filtros"
                            >
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                <span className="hidden sm:inline">Limpiar</span>
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Toggle */}
                        <div className="border rounded-md flex">
                            <Button
                                variant={currentView === 'table' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-r-none h-9 px-2.5 sm:px-3"
                                onClick={() => onViewChange('table')}
                                title="Vista de Tabla"
                            >
                                <ArrowDownUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                                variant={currentView === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-none h-9 px-2.5 sm:px-3"
                                onClick={() => onViewChange('list')}
                                title="Vista de Lista"
                            >
                                <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                                variant={currentView === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                className="rounded-l-none h-9 px-2.5 sm:px-3"
                                onClick={() => onViewChange('grid')}
                                title="Vista de Cuadrícula"
                            >
                                <Grid2X2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Button>
                        </div>

                        {/* New Loan Button */}
                        <Button
                            onClick={handleNewLoan}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer h-9 px-3 sm:px-4 text-xs sm:text-sm"
                        >
                            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">Nuevo Préstamo</span>
                        </Button>
                    </div>
                </div>
            </div>

            <hr className="border-t border-muted" />
        </div>
    );
} 
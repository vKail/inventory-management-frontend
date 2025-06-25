import { ArrowDownUp, List, Grid2X2, Plus, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLoanStore } from "../../context/loan-store";
import { useCallback } from "react";
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
] as const;

export function LoanHeader({
    onViewChange,
    currentView,
}: LoanHeaderProps) {
    const router = useRouter();
    const { setFilters, filters, clearFilters } = useLoanStore();

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

    const hasActiveFilters = filters.deliveryDateRange !== 'all' ||
        filters.dueDateRange !== 'all' ||
        (filters.status && filters.status !== 'all');

    return (
        <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:w-auto py-2 mb-4">
                    <div className="relative">
                        <Select
                            onValueChange={handleDeliveryDateRangeChange}
                            defaultValue={filters.deliveryDateRange}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Fecha de Entrega" />
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

                    <div className="relative">
                        <Select
                            onValueChange={handleDueDateRangeChange}
                            defaultValue={filters.dueDateRange}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Fecha de Vencimiento" />
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

                    <Select
                        onValueChange={handleStatusChange}
                        defaultValue={filters.status}
                    >
                        <SelectTrigger className="w-full sm:w-[180px]">
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
                        onClick={handleNewLoan}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nuevo Préstamo</span>
                    </Button>
                </div>
            </div>
            <hr className="border-t border-muted mt-4" />
        </div>
    );
} 
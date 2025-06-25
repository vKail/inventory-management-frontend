import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoanStatus, LoanFilters } from "@/features/loans/data/interfaces/loan.interface";

interface LoanFilterProps {
    onFilterChange: (filters: Partial<LoanFilters>) => void;
    initialFilters: LoanFilters;
}

const DATE_RANGES = [
    { value: "all", label: "Todos" },
    { value: "7days", label: "Últimos 7 días" },
    { value: "1month", label: "Último mes" },
    { value: "6months", label: "Últimos 6 meses" },
    { value: "1year", label: "Último año" }
] as const;

export function LoanFilter({ onFilterChange, initialFilters }: LoanFilterProps) {
    const handleStatusChange = (value: string) => {
        onFilterChange({ status: value as LoanStatus | 'all' });
    };

    const handleDeliveryDateRangeChange = (value: string) => {
        onFilterChange({ deliveryDateRange: value });
    };

    const handleDueDateRangeChange = (value: string) => {
        onFilterChange({ dueDateRange: value });
    };

    return (
        <div className="flex gap-4">
            <Select
                value={initialFilters.deliveryDateRange || 'all'}
                onValueChange={handleDeliveryDateRangeChange}
            >
                <SelectTrigger className="w-[200px]">
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

            <Select
                value={initialFilters.dueDateRange || 'all'}
                onValueChange={handleDueDateRangeChange}
            >
                <SelectTrigger className="w-[200px]">
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

            <Select
                value={initialFilters.status || 'all'}
                onValueChange={handleStatusChange}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value={LoanStatus.DELIVERED}>Entregado</SelectItem>
                    <SelectItem value={LoanStatus.RETURNED}>Devuelto</SelectItem>
                    <SelectItem value={LoanStatus.OVERDUE}>Devuelto con Retraso</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
} 
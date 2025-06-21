import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoanStatus, LoanFilters } from "@/features/loans/data/interfaces/loan.interface";

interface LoanFilterProps {
    onFilterChange: (filters: Partial<LoanFilters>) => void;
    initialFilters: LoanFilters;
}

export function LoanFilter({ onFilterChange, initialFilters }: LoanFilterProps) {
    const handleStatusChange = (value: string) => {
        onFilterChange({ status: value as LoanStatus | 'all' });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ search: event.target.value });
    };

    return (
        <div className="flex gap-4">
            <Input
                placeholder="Buscar préstamos..."
                value={initialFilters.search || ''}
                onChange={handleSearchChange}
                className="max-w-sm"
            />
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
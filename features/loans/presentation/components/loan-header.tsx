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

export function LoanHeader({
    onViewChange,
    currentView,
}: LoanHeaderProps) {
    const router = useRouter();
    const { setFilters, filters } = useLoanStore();

    const handleSearch = useCallback((value: string) => {
        setFilters({ search: value });
    }, [setFilters]);

    const handleStatusChange = useCallback((value: string) => {
        setFilters({ status: value });
    }, [setFilters]);

    const handleNewLoan = () => {
        router.push('/loans/new');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar préstamos..."
                            className="pl-8"
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>

                    <Select
                        onValueChange={handleStatusChange}
                        defaultValue={filters.status}
                    >
                        <SelectTrigger className="w-[180px]">
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
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Nuevo Préstamo</span>
                    </Button>
                </div>
            </div>
        </div>
    );
} 
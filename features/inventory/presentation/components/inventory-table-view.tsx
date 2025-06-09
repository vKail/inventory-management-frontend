import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useColumns } from "./table-components/columns";
import { CellContext, HeaderContext } from "@tanstack/react-table";

interface InventoryTableViewProps {
    items: InventoryItem[];
    onItemClick: (item: InventoryItem) => void;
}

export function InventoryTableView({ items, onItemClick }: InventoryTableViewProps) {
    const columns = useColumns();

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={`header-${column.id}`}>
                                {typeof column.header === 'string'
                                    ? column.header
                                    : column.header?.({ column } as HeaderContext<InventoryItem, unknown>)}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow
                            key={`row-${item.id}`}
                            className="cursor-pointer"
                            onClick={() => onItemClick(item)}
                        >
                            {columns.map((column) => (
                                <TableCell key={`cell-${item.id}-${column.id}`}>
                                    {column.cell && typeof column.cell === 'function'
                                        ? column.cell({
                                            row: {
                                                original: item,
                                                getValue: (key: string) => item[key as keyof InventoryItem]
                                            }
                                        } as CellContext<InventoryItem, unknown>)
                                        : item[(column as any).accessorKey as keyof InventoryItem]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
} 
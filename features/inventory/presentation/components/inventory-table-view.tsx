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
import { useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";

interface InventoryTableViewProps {
    items: InventoryItem[];
}

export function InventoryTableView({ items }: InventoryTableViewProps) {
    const columns = useColumns();
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isScanModalOpen, setIsScanModalOpen] = useState(false);

    const handleItemClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsDetailsModalOpen(true);
    };

    const handleScanComplete = (item: InventoryItem | null) => {
        if (item) {
            setSelectedItem(item);
            setIsDetailsModalOpen(true);
        }
    };

    return (
        <>
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
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleItemClick(item)}
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

            <ScanProcessModal
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedItem(null);
                }}
                initialItem={selectedItem}
            />

            <ScanProcessModal
                isOpen={isScanModalOpen}
                onClose={() => {
                    setIsScanModalOpen(false);
                }}
                onScanComplete={handleScanComplete}
            />
        </>
    );
} 
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";

interface InventoryListViewProps {
    items: InventoryItem[];
}

export function InventoryListView({ items }: InventoryListViewProps) {
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
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="space-y-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                Código: {item.code}
                            </p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-sm text-muted-foreground">
                                Categoría: {item.category?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Tipo: {item.itemType?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Estado: {item.status?.name}
                            </p>
                        </div>
                    </div>
                ))}
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
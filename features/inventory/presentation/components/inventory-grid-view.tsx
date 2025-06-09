import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ScanProcessModal } from "./scan-process-modal";

interface InventoryGridViewProps {
    items: InventoryItem[];
}

export function InventoryGridView({ items }: InventoryGridViewProps) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                    <Card
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleItemClick(item)}
                    >
                        <CardHeader>
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Código: {item.code}
                                </p>
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
                        </CardContent>
                    </Card>
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
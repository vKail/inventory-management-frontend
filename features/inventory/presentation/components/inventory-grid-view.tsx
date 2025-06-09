import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { InventoryCard } from "./card-components/inventory-card";

interface InventoryGridViewProps {
    items: InventoryItem[];
    onItemClick: (item: InventoryItem) => void;
}

export function InventoryGridView({ items, onItemClick }: InventoryGridViewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {items.map((item) => (
                <InventoryCard
                    key={item.id}
                    item={item}
                    onClick={() => onItemClick(item)}
                />
            ))}
        </div>
    );
} 
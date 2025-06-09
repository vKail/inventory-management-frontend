import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { InventoryListItem } from "./list-components/inventory-list-item";

interface InventoryListViewProps {
    items: InventoryItem[];
    onItemClick: (item: InventoryItem) => void;
}

export function InventoryListView({ items, onItemClick }: InventoryListViewProps) {
    return (
        <div className="flex flex-col gap-2 p-4">
            {items.map((item) => (
                <InventoryListItem
                    key={item.id}
                    item={item}
                    onClick={() => onItemClick(item)}
                />
            ))}
        </div>
    );
} 
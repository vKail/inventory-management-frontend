import { InventoryItem } from "../../../data/interfaces/inventory.interface";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InventoryListItemProps {
    item: InventoryItem;
    onClick: () => void;
}

export function InventoryListItem({ item, onClick }: InventoryListItemProps) {
    return (
        <div
            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={onClick}
        >
            <div className="flex items-center gap-4">
                <div className="space-y-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.code}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Badge variant={item.stock > 0 ? "default" : "destructive"}>
                        Stock: {item.stock}
                    </Badge>
                    <Badge variant="outline">
                        {item.status?.name || "Sin estado"}
                    </Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                    {item.acquisitionDate
                        ? format(new Date(item.acquisitionDate), "PPP", { locale: es })
                        : "Sin fecha"}
                </div>

                <div className="flex gap-2">
                    {item.critical && (
                        <Badge variant="destructive">Crítico</Badge>
                    )}
                    {item.dangerous && (
                        <Badge variant="destructive">Peligroso</Badge>
                    )}
                    {item.perishable && (
                        <Badge variant="outline">Perecedero</Badge>
                    )}
                </div>
            </div>
        </div>
    );
} 
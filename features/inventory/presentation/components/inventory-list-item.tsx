import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";

interface Props {
    product: InventoryItem;
    viewMode: "grid" | "list";
}

export const InventoryListItem = ({ product, viewMode }: Props) => {
    return (
        <Card className={viewMode === "grid" ? "w-full" : "flex w-full"}>
            <CardContent className="p-4 flex gap-4">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm">{product.description}</p>
                    <p className="text-xs text-muted-foreground">
                        Código: {product.barcode} | Cantidad: {product.quantity}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline">Ver detalles</Button>
                    <Button>Solicitar</Button>
                </div>
            </CardContent>
        </Card>
    );
};

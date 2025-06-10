import { InventoryItem } from "../../../data/interfaces/inventory.interface";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface InventoryCardProps {
    item: InventoryItem;
    onClick: () => void;
}

export function InventoryCard({ item, onClick }: InventoryCardProps) {
    return (
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.code}</p>
                    </div>
                    <Badge variant={item.stock > 0 ? "default" : "destructive"}>
                        Stock: {item.stock}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Estado:</span>
                        <Badge variant="outline">
                            {item.status?.name || "Sin estado"}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Categoría:</span>
                        <span className="text-sm">{item.category?.name || "Sin categoría"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Fecha de Adquisición:</span>
                        <span className="text-sm">
                            {item.acquisitionDate
                                ? format(new Date(item.acquisitionDate), "PPP", { locale: es })
                                : "Sin fecha"}
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex gap-2">
                    {item.critical && (
                        <Badge variant="destructive">Crítico</Badge>
                    )}
                    {item.dangerous && (
                        <Badge variant="destructive">Peligroso</Badge>
                    )}
                    {item.perishable && (
                        <Badge variant="default">Perecedero</Badge>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
} 
"use client";

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { Package } from "lucide-react";

type Props = {
    item: InventoryItem;
    onViewClick?: (item: InventoryItem) => void;
};

export const InventoryCard = ({ item, onViewClick }: Props) => {
return (
        <Card className="h-full flex flex-col">
            <CardContent className="p-4 flex flex-col gap-3 flex-1">
                <div className="aspect-square rounded-lg border overflow-hidden">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <Package className="h-20 w-20 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Código: {item.code}</span>
                        <Badge variant={item.status?.name === "Activo" ? "default" : "secondary"}>
                            {item.status?.name || "Sin estado"}
                        </Badge>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    variant="secondary"
                    onClick={() => onViewClick?.(item)}
                >
                    Ver Detalles
                </Button>
            </CardFooter>
        </Card>
    );
};

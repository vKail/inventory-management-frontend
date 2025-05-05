"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { ProductStatus } from "@/features/inventory/data/interfaces/inventory.interface";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
    item: InventoryItem;
    onViewClick?: (item: InventoryItem) => void;
    onLoanClick?: (item: InventoryItem) => void;
};

export const InventoryCard = ({ item, onViewClick, onLoanClick }: Props) => {
    const statusLabels = {
        [ProductStatus.AVAILABLE]: "Disponible",
        [ProductStatus.IN_USE]: "En uso",
        [ProductStatus.MAINTENANCE]: "En mantenimiento",
        [ProductStatus.DAMAGED]: "Dañado",
    };

    const statusColors = {
        [ProductStatus.AVAILABLE]: "bg-green-100 text-green-800",
        [ProductStatus.IN_USE]: "bg-blue-100 text-blue-800",
        [ProductStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
        [ProductStatus.DAMAGED]: "bg-red-100 text-red-800",
    };

    return (
        <Card className="flex flex-col h-full rounded-xl shadow-sm">
            <CardHeader className="pb-1">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="font-semibold text-base truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {item.category} - {item.department}
                        </p>
                    </div>
                    <Badge
                        className={`${statusColors[item.status as ProductStatus]} text-xs px-2 py-1 rounded-full`}
                        variant="outline"
                    >
                        {statusLabels[item.status]}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="py-2">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-3 overflow-hidden">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-auto object-contain"
                            style={{ maxHeight: '150px' }}
                        />
                    ) : (
                        <div className="text-sm text-muted-foreground">Sin imagen</div>
                    )}
                </div>
                <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-medium">{item.barcode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Cantidad:</span>
                        <span className="font-medium">{item.quantity}</span>
                    </div>
                    <div className="text-muted-foreground">Descripción:</div>
                    <div className="font-medium truncate">{item.description}</div>
                </div>
            </CardContent>

            <CardFooter className="pt-2 flex gap-2">
                <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => onViewClick?.(item)}
                >
                    Ver detalles
                </Button>
                {item.status === ProductStatus.AVAILABLE && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onLoanClick?.(item)}
                    >
                        Solicitar
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger className="px-2">...</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Obtener información</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
};

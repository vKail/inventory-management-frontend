"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { Eye } from "lucide-react";

interface Props {
  product: InventoryItem;
  onViewClick?: (product: InventoryItem) => void;
}

export const InventoryListItem = ({ product, onViewClick }: Props) => {
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{product.name}</h3>
            <Badge variant={product.status?.name === "Activo" ? "default" : "secondary"}>
              {product.status?.name || "Sin estado"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Código: {product.code}</p>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-2 text-sm">
            <span>
              <span className="text-muted-foreground">Categoría:</span>{" "}
              {product.category?.name || "Sin categoría"}
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              <span className="text-muted-foreground">Ubicación:</span>{" "}
              {product.location?.name || "Sin ubicación"}
            </span>
            <span className="hidden md:inline">•</span>
            <span>
              <span className="text-muted-foreground">Stock:</span> {product.stock}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewClick?.(product)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Ver Detalles
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InventoryItem, ProductStatus } from "@/features/inventory/data/interfaces/inventory.interface";
import { Package } from "lucide-react";

interface Props {
  product: InventoryItem;
  viewMode: "grid" | "list";
  onViewClick?: (product: InventoryItem) => void;
  onLoanClick?: (product: InventoryItem) => void;
}

export const InventoryListItem = ({ product, viewMode, onViewClick, onLoanClick }: Props) => {
  const statusColors = {
    [ProductStatus.AVAILABLE]: "bg-green-100 text-green-800",
    [ProductStatus.IN_USE]: "bg-yellow-100 text-yellow-800",
    [ProductStatus.MAINTENANCE]: "bg-blue-100 text-blue-800",
    [ProductStatus.DAMAGED]: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    [ProductStatus.AVAILABLE]: "Disponible",
    [ProductStatus.IN_USE]: "En uso",
    [ProductStatus.MAINTENANCE]: "En mantenimiento",
    [ProductStatus.DAMAGED]: "Dañado",
  };

  if (viewMode === "grid") {
    return (
      <Card className="h-full flex flex-col">
        <CardContent className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex justify-center items-center bg-gray-100 rounded-lg h-40">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain rounded"
              />
            ) : (
              <Package className="h-20 w-20 text-gray-400" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">Código: {product.barcode}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[product.status]}`}>
                {statusLabels[product.status]}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-auto pt-2">
            <Button
              variant="outline"
              className="flex-1"
              size="sm"
              onClick={() => onViewClick?.(product)}
            >
              Ver
            </Button>
            <Button
              className="flex-1"
              size="sm"
              onClick={() => onLoanClick?.(product)}
              disabled={product.status !== ProductStatus.AVAILABLE}
            >
              Solicitar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view
  return (
    <Card className="w-full">
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain rounded"
              />
            ) : (
              <Package className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">Código: {product.barcode}</p>
            <p className="text-sm">Categoría: {product.category}</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm line-clamp-2">{product.description}</p>
        </div>
        <div className="flex flex-col md:items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[product.status]}`}>
            {statusLabels[product.status]}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewClick?.(product)}
            >
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoanClick?.(product)}
              disabled={product.status !== ProductStatus.AVAILABLE}
            >
              Solicitar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
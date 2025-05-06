// Definiciones locales de tipos

import { Product, ProductStatus } from "@/shared/components/inventory/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductCardProps {
  product: Product;
  onLoanClick?: (product: Product) => void;
  onViewClick?: (product: Product) => void;
}

export function ProductCard({
  product,
  onLoanClick,
  onViewClick,
}: ProductCardProps) {
  const statusColors = {
    [ProductStatus.AVAILABLE]: "bg-green-100 text-green-800",
    [ProductStatus.IN_USE]: "bg-blue-100 text-blue-800",
    [ProductStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
    [ProductStatus.DAMAGED]: "bg-red-100 text-red-800",
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{product.name}</h3>
            <p className="text-muted-foreground text-sm line-clamp-1">
              {product.category} - {product.department}
            </p>
          </div>
          <Badge className={statusColors[product.status]} variant="outline">
            {product.status === ProductStatus.IN_USE
              ? "En uso"
              : product.status === ProductStatus.AVAILABLE
              ? "Disponible"
              : product.status === ProductStatus.MAINTENANCE
              ? "En mantenimiento"
              : "Dañado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-2">
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="text-muted-foreground">Sin imagen</div>
          )}
        </div>
        <div className="grid gap-1">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Código:</span>
            <span className="text-sm font-medium">{product.barcode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cantidad:</span>
            <span className="text-sm font-medium">{product.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground pr-3">Descripción:</span>
            <span className="text-sm font-medium">{product.description}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onViewClick?.(product)}
        >
          Ver detalles
        </Button>
        {product.status === ProductStatus.AVAILABLE && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onLoanClick?.(product)}
          >
            Solicitar
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>...</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Opciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Obtener información</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
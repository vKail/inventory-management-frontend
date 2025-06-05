import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface InventoryDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: InventoryItem | null;
}

export const InventoryDetailsModal = ({ isOpen, onClose, product }: InventoryDetailsModalProps) => {
    const router = useRouter();

    if (!product) return null;

    const handleCopy = () => {
        const details = `
            Código: ${product.code}
            Nombre: ${product.name}
            Descripción: ${product.description}
            Stock: ${product.stock}
            Estado: ${product.status?.name}
            Categoría: ${product.category?.name}
            Ubicación: ${product.location?.name}
            Tipo: ${product.itemType}
            Disponible para préstamo: ${product.availableForLoan ? 'Sí' : 'No'}
            Condición: ${product.condition}
            Características del modelo: ${product.modelCharacteristics}
            Marca/Raza/Otro: ${product.brandBreedOther}
            Crítico: ${product.critical ? 'Sí' : 'No'}
            Peligroso: ${product.dangerous ? 'Sí' : 'No'}
            Requiere manejo especial: ${product.requiresSpecialHandling ? 'Sí' : 'No'}
            Perecedero: ${product.perishable ? 'Sí' : 'No'}
        `.trim();

        navigator.clipboard.writeText(details);
        toast.success("Detalles copiados al portapapeles");
    };

    const handleEdit = () => {
        router.push(`/inventory/edit/${product.id}`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Detalles del Producto</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-12 gap-6 mt-4">
                    {/* Left side - Image */}
                    <div className="col-span-12 md:col-span-4">
                        <div className="aspect-square rounded-lg border overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Package className="h-20 w-20 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side - Scrollable Details */}
                    <div className="col-span-12 md:col-span-8">
                        <div className="max-h-[calc(80vh-200px)] overflow-y-auto pr-4">
                            <div className="space-y-6">
                                {/* General Information */}
                                <div>
                                    <h3 className="font-semibold mb-4">Información General</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Nombre:</span>
                                            <p className="font-medium">{product.name}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Código:</span>
                                            <p className="font-medium">{product.code}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Descripción:</span>
                                            <p>{product.description}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Stock:</span>
                                            <p className="font-medium">{product.stock}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Estado:</span>
                                            <Badge className="mt-1" variant={product.status?.name === 'Activo' ? 'default' : 'secondary'}>
                                                {product.status?.name || 'Sin estado'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div>
                                    <h3 className="font-semibold mb-4">Detalles Adicionales</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm text-muted-foreground">Categoría:</span>
                                            <Badge variant="outline" className="mt-1">
                                                {product.category?.name || 'Sin categoría'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Ubicación:</span>
                                            <p>{product.location?.name || 'Sin ubicación'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Tipo:</span>
                                            <p>{product.itemType?.name || 'Sin tipo'}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-muted-foreground">Disponible para préstamo:</span>
                                            <p>{product.availableForLoan ? 'Sí' : 'No'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Special Characteristics */}
                                <div>
                                    <h3 className="font-semibold mb-4">Características Especiales</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Badge variant={product.critical ? 'destructive' : 'outline'}>
                                                {product.critical ? 'Crítico' : 'No Crítico'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Badge variant={product.dangerous ? 'destructive' : 'outline'}>
                                                {product.dangerous ? 'Peligroso' : 'No Peligroso'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Badge variant={product.requiresSpecialHandling ? 'destructive' : 'outline'}>
                                                {product.requiresSpecialHandling ? 'Manejo Especial' : 'Manejo Normal'}
                                            </Badge>
                                        </div>
                                        <div>
                                            <Badge variant={product.perishable ? 'destructive' : 'outline'}>
                                                {product.perishable ? 'Perecedero' : 'No Perecedero'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={handleCopy}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Detalles
                    </Button>
                    <Button onClick={handleEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
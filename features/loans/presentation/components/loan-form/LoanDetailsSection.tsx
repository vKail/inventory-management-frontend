import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package, X, Scan, Box, ImageIcon } from "lucide-react";
import { ScannedItem } from "@/features/loans/hooks/use-scanned-items";
import { ICondition } from "@/features/conditions/data/interfaces/condition.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URLIMAGE;

interface LoanDetailsSectionProps {
    scannedItems: ScannedItem[];
    conditions: ICondition[];
    setIsScanModalOpen: (open: boolean) => void;
    handleRemoveItem: (code: string) => void;
    handleExitConditionChange: (itemCode: string, conditionId: string | number) => void;
    handleQuantityChange: (itemCode: string, quantity: number) => void;
    handleObservationsChange: (code: string, observations: string) => void;
}

export default function LoanDetailsSection({
    scannedItems,
    conditions,
    setIsScanModalOpen,
    handleRemoveItem,
    handleExitConditionChange,
    handleQuantityChange,
    handleObservationsChange
}: LoanDetailsSectionProps) {
    return (
        <Card data-section="loan-details">
            <CardHeader className="pb-3 px-3 sm:px-6">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span className="hidden sm:inline">Items del Préstamo</span>
                        <span className="sm:hidden">Items</span>
                    </CardTitle>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => setIsScanModalOpen(true)}
                    >
                        <Scan className="h-3 w-3 sm:mr-1" />
                        <span className="hidden sm:inline">Escanear</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
                {scannedItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded">
                        <Box className="h-12 w-12 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">No hay items agregados</p>
                        <p className="text-xs mt-1">Haz clic en "Escanear" para agregar items al préstamo</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {scannedItems.map((item) => (
                            <Card key={item.code} className="relative overflow-hidden hover:shadow-md transition-shadow">
                                {/* Delete button */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6 z-10 bg-background/80 hover:bg-destructive/90 hover:text-destructive-foreground rounded-full shadow-sm"
                                    onClick={() => handleRemoveItem(item.code)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>

                                <CardHeader className="p-2 sm:p-3 pb-2">
                                    {/* Image */}
                                    <div className="relative w-full h-24 sm:h-32 bg-muted rounded-md overflow-hidden mb-2">
                                        {item.image ? (
                                            <img
                                                src={`${API_URL}${item.image}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Item info */}
                                    <div>
                                        <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-muted-foreground">{item.code}</p>
                                            <Badge variant="outline" className="text-xs">
                                                Stock: {item.stock}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-2 sm:p-3 pt-0 space-y-2">
                                    {/* Condition */}
                                    <div>
                                        <Label htmlFor={`condition-${item.code}`} className="text-[10px] sm:text-xs text-muted-foreground">
                                            Condición de Salida
                                        </Label>
                                        <Select
                                            value={item.exitConditionId?.toString() || ""}
                                            onValueChange={(value) => handleExitConditionChange(item.code, value)}
                                        >
                                            <SelectTrigger id={`condition-${item.code}`} className="h-8 text-xs mt-1">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {conditions.map((condition) => (
                                                    <SelectItem
                                                        key={condition.id}
                                                        value={condition.id.toString()}
                                                        className="text-xs"
                                                    >
                                                        {condition.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <Label htmlFor={`quantity-${item.code}`} className="text-[10px] sm:text-xs text-muted-foreground">
                                            Cantidad a Prestar
                                        </Label>
                                        <Input
                                            id={`quantity-${item.code}`}
                                            type="number"
                                            min="1"
                                            max={item.stock}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.code, parseInt(e.target.value) || 1)}
                                            className="h-8 text-xs mt-1"
                                        />
                                    </div>

                                    {/* Observations */}
                                    <div>
                                        <Label htmlFor={`obs-${item.code}`} className="text-[10px] sm:text-xs text-muted-foreground">
                                            Observaciones (Opcional)
                                        </Label>
                                        <Textarea
                                            id={`obs-${item.code}`}
                                            value={item.exitObservations}
                                            onChange={(e) => handleObservationsChange(item.code, e.target.value)}
                                            placeholder="Ej: Rayado..."
                                            rows={2}
                                            maxLength={250}
                                            className="text-xs resize-none mt-1"
                                        />
                                    </div>
                                </CardContent>

                                {item.characteristics && (
                                    <CardFooter className="p-2 sm:p-3 pt-0">
                                        <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">
                                            <span className="font-medium">Características:</span> {item.characteristics}
                                        </p>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

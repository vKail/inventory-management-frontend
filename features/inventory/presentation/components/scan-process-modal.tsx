import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Box, Copy, Edit, Loader2, QrCode, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryItem } from "../../data/interfaces/inventory.interface";
import { useInventoryStore } from "../../context/inventory-store";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ScanProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanComplete?: (item: InventoryItem | null) => void;
    initialItem?: InventoryItem | null;
}

export function ScanProcessModal({ isOpen, onClose, onScanComplete, initialItem }: ScanProcessModalProps) {
    const router = useRouter();
    const { getInventoryItemByCode, getInventoryItem } = useInventoryStore();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [error, setError] = useState("");
    const [isReadyToSearch, setIsReadyToSearch] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const [foundItem, setFoundItem] = useState<InventoryItem | null>(initialItem || null);
    const inputRef = useRef<HTMLInputElement>(null);
    const barcodeBuffer = useRef("");
    const lastKeyTime = useRef(0);
    const API_URL = process.env.NEXT_PUBLIC_API_URLIMAGE || 'https://gitt-api-3tw6.onrender.com/';

    useEffect(() => {
        if (!isOpen) {
            // Reset states when modal closes
            setIsScanning(false);
            setScannedCode("");
            setError("");
            setIsReadyToSearch(false);
            setManualInput("");
            setFoundItem(initialItem || null);
            barcodeBuffer.current = "";
            return;
        }

        // If we have an initial code or ID, start the search immediately
        if (scannedCode) {
            handleScan(scannedCode);
        } else if (initialItem) {
            setFoundItem(initialItem);
        } else {
            // Focus the manual input when modal opens
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }

        // Start listening for barcode scanner input
        const handleKeyPress = (event: KeyboardEvent) => {
            const currentTime = new Date().getTime();

            // If more than 100ms have passed since the last key, reset the buffer
            if (currentTime - lastKeyTime.current > 100) {
                barcodeBuffer.current = "";
            }

            lastKeyTime.current = currentTime;

            if (event.key === "Enter") {
                if (barcodeBuffer.current) {
                    console.log('Barcode scanned:', barcodeBuffer.current);
                    setScannedCode(barcodeBuffer.current);
                    setIsReadyToSearch(true);
                    barcodeBuffer.current = "";
                }
            } else {
                barcodeBuffer.current += event.key;
            }
        };

        window.addEventListener("keypress", handleKeyPress);
        return () => window.removeEventListener("keypress", handleKeyPress);
    }, [isOpen, scannedCode, initialItem]);

    const handleScan = async (code: string) => {
        if (!code) return;

        console.log('Starting scan with code:', code);
        setIsScanning(true);
        setError("");

        try {
            // Primero intentamos buscar por código
            let item = await getInventoryItemByCode(code);
            console.log('Item found by code:', item);

            // Si no se encuentra por código, intentamos buscar por ID
            if (!item) {
                const foundById = await getInventoryItem(code);
                console.log('Item found by ID:', foundById);
                if (foundById) {
                    item = foundById;
                }
            }

            if (item) {
                console.log('Final item to display:', item);
                setFoundItem(item);
                onScanComplete?.(item);
                toast.success("Item encontrado");
            } else {
                setError(`No se ha encontrado un producto con el código ${code}`);
                onScanComplete?.(null);
                toast.error("Item no encontrado");
            }
        } catch (error) {
            console.error('Scan error:', error);
            setError("Error al buscar el producto");
            onScanComplete?.(null);
            toast.error("Error al buscar el producto");
        } finally {
            setIsScanning(false);
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim()) {
            setScannedCode(manualInput.trim());
            setIsReadyToSearch(true);
        }
    };

    const handleCancel = () => {
        setScannedCode("");
        setIsReadyToSearch(false);
        setManualInput("");
        setFoundItem(initialItem || null);
    };

    const handleEditItem = () => {
        if (foundItem) {
            router.push(`/inventory/edit/${foundItem.id}`);
            onClose();
        }
    };

    const handleCopy = () => {
        if (!foundItem) return;

        const formattedItem = {
            "Código": foundItem.code,
            "Nombre": foundItem.name,
            "Descripción": foundItem.description,
            "Stock": foundItem.stock,
            "Tipo": foundItem.itemType?.name,
            "Categoría": foundItem.category?.name,
            "Estado": foundItem.status?.name,
            "Condición": foundItem.condition?.name,
            "Ubicación": foundItem.location?.name,
            "Fecha de Adquisición": foundItem.acquisitionDate ? format(new Date(foundItem.acquisitionDate), "PPP", { locale: es }) : "N/A",
            "Fecha de Garantía": foundItem.warrantyDate ? format(new Date(foundItem.warrantyDate), "PPP", { locale: es }) : "N/A",
            "Fecha de Expiración": foundItem.expirationDate ? format(new Date(foundItem.expirationDate), "PPP", { locale: es }) : "N/A",
            "Crítico": foundItem.critical ? "Sí" : "No",
            "Peligroso": foundItem.dangerous ? "Sí" : "No",
            "Requiere Manejo Especial": foundItem.requiresSpecialHandling ? "Sí" : "No",
            "Perecedero": foundItem.perishable ? "Sí" : "No",
            "Disponible para Préstamo": foundItem.availableForLoan ? "Sí" : "No",
            "Observaciones": foundItem.observations || "N/A"
        };

        const text = Object.entries(formattedItem)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        navigator.clipboard.writeText(text);
        toast.success("Información copiada al portapapeles");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-7xl w-[150vh] h-[90vh] max-h-[90vh] transition-all duration-300 ${foundItem ? 'opacity-100' : 'opacity-90'}`}>
                <DialogTitle className="text-xl font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        <span>Escáner de Inventario</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogTitle>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!foundItem ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6">
                            <div className="w-full max-w-md space-y-4">
                                <div className="text-center space-y-2">
                                    <QrCode className="h-12 w-12 mx-auto text-primary" />
                                    <h3 className="text-lg font-medium">Escanea un código de barras</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Coloca el código de barras frente al escáner o ingresa el código manualmente
                                    </p>
                                </div>

                                <form onSubmit={handleManualSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Input
                                            ref={inputRef}
                                            type="text"
                                            placeholder="Ingresa el código manualmente"
                                            value={manualInput}
                                            onChange={(e) => setManualInput(e.target.value)}
                                            className="text-center text-lg"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit" className="flex-1" disabled={isScanning}>
                                            {isScanning ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Buscando...
                                                </>
                                            ) : (
                                                "Buscar"
                                            )}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>

                                {error && (
                                    <div className="text-sm text-red-500 text-center">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Imágenes */}
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Imágenes</h3>
                                        {foundItem.images && foundItem.images.length > 0 ? (
                                            <Carousel className="w-full">
                                                <CarouselContent>
                                                    {foundItem.images.map((image, index) => (
                                                        <CarouselItem key={index}>
                                                            <div className="aspect-square relative">
                                                                <img
                                                                    src={`${API_URL}${image.filePath}`}
                                                                    alt={`Imagen ${index + 1} de ${foundItem.name}`}
                                                                    className="object-cover rounded-lg w-full h-full"
                                                                />
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious />
                                                <CarouselNext />
                                            </Carousel>
                                        ) : (
                                            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                                                <Box className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Detalles del Item */}
                                    <div className="space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto pr-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">{foundItem.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={handleCopy}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="icon" onClick={handleEditItem}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Código</p>
                                                    <p className="font-medium">{foundItem.code}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Stock</p>
                                                    <p className="font-medium">{foundItem.stock}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Descripción</p>
                                                <p className="text-sm">{foundItem.description}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Clasificación</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Tipo</p>
                                                    <p className="font-medium">{foundItem.itemType?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Categoría</p>
                                                    <p className="font-medium">{foundItem.category?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Estado</p>
                                                    <p className="font-medium">{foundItem.status?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Condición</p>
                                                    <p className="font-medium">{foundItem.condition?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Ubicación</p>
                                                    <p className="font-medium">{foundItem.location?.name}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Fechas</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Adquisición</p>
                                                    <p className="font-medium">
                                                        {foundItem.acquisitionDate ? format(new Date(foundItem.acquisitionDate), "PPP", { locale: es }) : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Garantía</p>
                                                    <p className="font-medium">
                                                        {foundItem.warrantyDate ? format(new Date(foundItem.warrantyDate), "PPP", { locale: es }) : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Expiración</p>
                                                    <p className="font-medium">
                                                        {foundItem.expirationDate ? format(new Date(foundItem.expirationDate), "PPP", { locale: es }) : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h4 className="font-medium">Características</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {foundItem.critical && <Badge variant="destructive">Crítico</Badge>}
                                                {foundItem.dangerous && <Badge variant="destructive">Peligroso</Badge>}
                                                {foundItem.requiresSpecialHandling && <Badge>Manejo Especial</Badge>}
                                                {foundItem.perishable && <Badge>Perecedero</Badge>}
                                                {foundItem.availableForLoan && <Badge variant="secondary">Disponible para Préstamo</Badge>}
                                            </div>
                                        </div>

                                        {foundItem.observations && (
                                            <div className="space-y-2">
                                                <h4 className="font-medium">Observaciones</h4>
                                                <p className="text-sm text-muted-foreground">{foundItem.observations}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 p-4 border-t">
                                <Button variant="outline" onClick={onClose}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cerrar
                                </Button>
                                <Button variant="outline" onClick={handleCopy}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copiar
                                </Button>
                                <Button onClick={handleEditItem}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 
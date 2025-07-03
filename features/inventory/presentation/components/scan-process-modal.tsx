            import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Box, Copy, Edit, Loader2, Barcode, X } from "lucide-react";
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

        // Security: Validate input to prevent path injection and malicious inputs
        const sanitizedCode = code.trim();

        // Reject inputs that could be paths or contain dangerous characters
        if (sanitizedCode.includes('/') ||
            sanitizedCode.includes('\\') ||
            sanitizedCode.includes('..') ||
            sanitizedCode.includes('http') ||
            sanitizedCode.includes('://') ||
            sanitizedCode.length > 50) {
            setError("Código inválido. Solo se permiten códigos de barras válidos.");
            onScanComplete?.(null);
            toast.error("Código inválido");
            setManualInput(""); // Clear the input field
            return;
        }

        // Only allow alphanumeric characters, hyphens, and underscores for barcode codes
        const validCodePattern = /^[a-zA-Z0-9\-_]+$/;
        if (!validCodePattern.test(sanitizedCode)) {
            setError("Código inválido. Solo se permiten letras, números, guiones y guiones bajos.");
            onScanComplete?.(null);
            toast.error("Código inválido");
            setManualInput(""); // Clear the input field
            return;
        }

        setIsScanning(true);
        setError("");

        try {
            // Solo buscar por código de barras - NO buscar por ID como fallback
            const item = await getInventoryItemByCode(sanitizedCode);

            if (item) {
                setFoundItem(item);
                onScanComplete?.(item);
                toast.success("Item encontrado");
            } else {
                setError(`No se ha encontrado un producto con el código ${sanitizedCode}`);
                onScanComplete?.(null);
                toast.error("Item no encontrado");
                setManualInput(""); // Clear the input field when item not found
            }
        } catch (error) {
            console.error('Scan error:', error);
            setError("Error al buscar el producto");
            onScanComplete?.(null);
            toast.error("Error al buscar el producto");
            setManualInput(""); // Clear the input field on error
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

        // Función para copiar al portapapeles con fallback
        const copyToClipboard = async (text: string) => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    // Método moderno para HTTPS
                    await navigator.clipboard.writeText(text);
                    toast.success("Información copiada al portapapeles");
                } else {
                    // Fallback para HTTP o navegadores antiguos
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    textArea.style.top = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();

                    try {
                        document.execCommand('copy');
                        toast.success("Información copiada al portapapeles");
                    } catch (err) {
                        toast.error("No se pudo copiar al portapapeles. Copia manual: " + text);
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            } catch (err) {
                toast.error("Error al copiar al portapapeles");
                console.error('Error copying to clipboard:', err);
            }
        };

        copyToClipboard(text);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-7xl w-[90vw] h-[90vh] max-h-[90vh] transition-all duration-300 flex flex-col">
                <DialogTitle className="text-xl font-semibold flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                        <Barcode className="h-5 w-5" />
                        <span>Escáner de Inventario</span>
                    </div>
                </DialogTitle>

                <div className="flex-1 overflow-hidden flex flex-col">
                    {!foundItem ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-6">
                            <div className="w-full max-w-md space-y-4">
                                <div className="text-center space-y-2">
                                    <Barcode className="h-12 w-12 mx-auto text-primary" />
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
                        <div className="flex flex-col md:flex-row gap-6 h-full w-full">
                            {/* Left Side */}
                            <div className="flex flex-col gap-4 min-w-[220px] max-w-[340px] w-full md:w-[35%] flex-shrink-0 overflow-y-auto px-2">
                                {/* Imágenes */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-base">Imágenes</h3>
                                    {foundItem.images && foundItem.images.length > 0 ? (
                                        <Carousel className="w-full max-w-[320px] mx-auto">
                                            <CarouselContent>
                                                {foundItem.images.map((image, index) => (
                                                    <CarouselItem key={index}>
                                                        <div className="aspect-square relative w-[320px] h-[320px] mx-auto">
                                                            <img
                                                                src={`${API_URL}${image.filePath}`}
                                                                alt={`Imagen ${index + 1} de ${foundItem.name}`}
                                                                className="object-cover rounded-lg w-full h-full"
                                                            />
                                                            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-between px-2 pointer-events-none">
                                                                <CarouselPrevious className="pointer-events-auto relative left-0 translate-x-0" />
                                                                <CarouselNext className="pointer-events-auto relative right-0 translate-x-0" />
                                                            </div>
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                        </Carousel>
                                    ) : (
                                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center w-[320px] h-[320px] mx-auto">
                                            <Box className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>

                                {/* Detalles Básicos */}
                                <div className="space-y-4 bg-secondary p-3 rounded-lg text-xs">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold truncate max-w-full md:max-w-[200px] lg:max-w-[320px]" title={foundItem.name}>{foundItem.name}</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 items-center">
                                        <div className="flex items-center gap-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground">Código</p>
                                                <p className="font-medium text-xs truncate max-w-full md:max-w-[200px] lg:max-w-[320px]" title={foundItem.code}>{foundItem.code}</p>
                                            </div>
                                            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(foundItem.code); toast.success('Código copiado') }} className="h-7 w-7" title="Copiar código">
                                                <Copy className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Stock</p>
                                            <p className="font-medium text-xs truncate max-w-full md:max-w-[200px] lg:max-w-[320px]" title={String(foundItem.stock)}>{foundItem.stock}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Descripción</p>
                                        <p className="text-xs truncate max-w-full md:max-w-[200px] lg:max-w-[320px]" title={foundItem.description}>{foundItem.description}</p>
                                    </div>
                                </div>

                                {/* Características */}
                                <div className="bg-secondary p-3 rounded-lg space-y-2 mt-2">
                                    <h4 className="font-medium text-base">Características</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {foundItem.critical && <Badge className="truncate max-w-full md:max-w-[80px] lg:max-w-[120px]" title="Crítico">Crítico</Badge>}
                                        {foundItem.dangerous && <Badge className="truncate max-w-full md:max-w-[80px] lg:max-w-[120px]" title="Peligroso">Peligroso</Badge>}
                                        {foundItem.requiresSpecialHandling && <Badge className="truncate max-w-full md:max-w-[120px] lg:max-w-[160px]" title="Manejo Especial">Manejo Especial</Badge>}
                                        {foundItem.perishable && <Badge className="truncate max-w-full md:max-w-[80px] lg:max-w-[120px]" title="Perecedero">Perecedero</Badge>}
                                        {foundItem.availableForLoan && <Badge className="truncate max-w-full md:max-w-[120px] lg:max-w-[160px]" title="Disponible para Préstamo">Disponible para Préstamo</Badge>}
                                        {!foundItem.critical && !foundItem.dangerous && !foundItem.requiresSpecialHandling &&
                                            !foundItem.perishable && !foundItem.availableForLoan && (
                                                <p className="text-xs text-muted-foreground">No hay características especiales</p>
                                            )}
                                    </div>
                                </div>

                                {/* Observaciones */}
                                {foundItem.observations && (
                                    <div className="bg-secondary p-3 rounded-lg space-y-2 mt-2">
                                        <h4 className="font-medium text-base">Observaciones</h4>
                                        <p className="text-xs text-muted-foreground truncate max-w-full md:max-w-[200px] lg:max-w-[320px]" title={foundItem.observations}>{foundItem.observations}</p>
                                    </div>
                                )}
                            </div>
                            {/* Right Side */}
                            <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto px-2">
                                {/* Clasificación */}
                                <div className="bg-secondary p-3 rounded-lg space-y-4">
                                    <h4 className="font-medium text-base">Clasificación</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Tipo</p>
                                            <p className="font-medium text-xs truncate max-w-full md:max-w-[100px] lg:max-w-[150px]" title={foundItem.itemType?.name}>{foundItem.itemType?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Categoría</p>
                                            <p className="font-medium text-xs truncate max-w-full md:max-w-[100px] lg:max-w-[150px]" title={foundItem.category?.name}>{foundItem.category?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Estado</p>
                                            <p className="font-medium text-xs truncate max-w-full md:max-w-[100px] lg:max-w-[150px]" title={foundItem.status?.name}>{foundItem.status?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Condición</p>
                                            <p className="font-medium text-xs truncate max-w-full md:max-w-[100px] lg:max-w-[150px]" title={foundItem.condition?.name}>{foundItem.condition?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Ubicación</p>
                                            <p className="font-medium text-xs truncate max-w-full md:max-w-[100px] lg:max-w-[150px]" title={foundItem.location?.name}>{foundItem.location?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Materiales */}
                                <div className="bg-secondary p-3 rounded-lg space-y-2">
                                    <h4 className="font-medium text-base">Materiales</h4>
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-2 min-w-[320px]">
                                            {foundItem.materials && foundItem.materials.length > 0 ? (
                                                foundItem.materials.map((itemMaterial, index) => (
                                                    <div key={index} className="flex flex-col items-center bg-white p-2 rounded-md min-w-[120px] max-w-[160px] text-xs">
                                                        {itemMaterial.isMainMaterial && (
                                                            <Badge variant="secondary" className="mb-1">Principal</Badge>
                                                        )}
                                                        <span className="truncate max-w-full" title={itemMaterial.material?.name}>{itemMaterial.material?.name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground">No hay materiales asignados</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Colores */}
                                <div className="bg-secondary p-3 rounded-lg space-y-2">
                                    <h4 className="font-medium text-base">Colores</h4>
                                    <div className="overflow-x-auto">
                                        <div className="flex gap-2 min-w-[320px]">
                                            {foundItem.colors && foundItem.colors.length > 0 ? (
                                                foundItem.colors.map((itemColor, index) => (
                                                    <div key={index} className="flex flex-col items-center bg-white p-2 rounded-md min-w-[120px] max-w-[160px] text-xs">
                                                        {itemColor.isMainColor && (
                                                            <Badge variant="secondary" className="mb-1">Principal</Badge>
                                                        )}
                                                        <div className="flex items-center gap-1 mb-1">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: itemColor.color?.hexCode }} />
                                                        </div>
                                                        <span className="truncate max-w-full" title={itemColor.color?.name}>{itemColor.color?.name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-muted-foreground">No hay colores asignados</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Fechas */}
                                <div className="bg-secondary p-4 rounded-lg space-y-4">
                                    <h4 className="font-medium text-lg">Fechas</h4>
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
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-2 p-4 border-t bg-muted/30">
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
            </DialogContent>
        </Dialog>
    );
} 
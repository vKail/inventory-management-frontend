import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Box, Copy, Edit, Loader2, Barcode, X, User, Calendar, MapPin, Tag, AlertTriangle, Shield, Clock, FileText } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            "Custodio": foundItem.custodian ? `${foundItem.custodian.person.firstName} ${foundItem.custodian.person.lastName}` : "N/A",
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
            <DialogContent className="sm:max-w-6xl w-[95vw] h-[95vh] max-h-[95vh] transition-all duration-300 flex flex-col">
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
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Header Card with Basic Info */}
                            <Card className="border-2 border-primary/20">
                                <CardContent className="p-6">
                                    <div className="flex gap-6">
                                        {/* Left side - Basic Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                {foundItem.code}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => { navigator.clipboard.writeText(foundItem.code); toast.success('Código copiado') }}
                                                                className="h-6 w-6"
                                                                title="Copiar código"
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                        <Badge variant="secondary" className="text-xs">
                                                            Stock: {foundItem.stock}
                                                        </Badge>
                                                        {foundItem.availableForLoan && (
                                                            <Badge className="bg-green-100 text-green-800 text-xs">
                                                                Disponible para Préstamo
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                                                        {foundItem.name}
                                                    </CardTitle>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {foundItem.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right side - Images */}
                                        <div className="flex-shrink-0">
                                            {foundItem.images && foundItem.images.length > 0 ? (
                                                <Carousel className="w-[320px]">
                                                    <CarouselContent>
                                                        {foundItem.images.map((image, index) => (
                                                            <CarouselItem key={index}>
                                                                <div className="aspect-square relative w-[320px] h-[320px]">
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
                                                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center w-[320px] h-[320px]">
                                                    <Box className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Classification and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Tag className="h-5 w-5" />
                                            Clasificación
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Tipo</p>
                                                <p className="text-sm font-semibold">{foundItem.itemType?.name || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Categoría</p>
                                                <p className="text-sm font-semibold">{foundItem.category?.name || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Estado</p>
                                                <p className="text-sm font-semibold">{foundItem.status?.name || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Condición</p>
                                                <p className="text-sm font-semibold">{foundItem.condition?.name || "N/A"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Ubicación y Custodio
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Ubicación</p>
                                            <p className="text-sm font-semibold">{foundItem.location?.name || "N/A"}</p>
                                        </div>
                                        {foundItem.custodian && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Custodio Responsable</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm font-semibold">
                                                            {foundItem.custodian.person.firstName} {foundItem.custodian.person.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            DNI: {foundItem.custodian.person.dni} | {foundItem.custodian.person.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Materials and Colors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Box className="h-5 w-5" />
                                            Materiales
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {foundItem.materials && foundItem.materials.length > 0 ? (
                                            <div className="space-y-2">
                                                {foundItem.materials.map((itemMaterial, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <span className="text-sm font-medium">{itemMaterial.material?.name}</span>
                                                        {itemMaterial.isMainMaterial && (
                                                            <Badge variant="secondary" className="text-xs">Principal</Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No hay materiales asignados</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-400 to-blue-500" />
                                            Colores
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {foundItem.colors && foundItem.colors.length > 0 ? (
                                            <div className="space-y-2">
                                                {foundItem.colors.map((itemColor, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                                style={{ backgroundColor: itemColor.color?.hexCode }}
                                                            />
                                                            <span className="text-sm font-medium">{itemColor.color?.name}</span>
                                                        </div>
                                                        {itemColor.isMainColor && (
                                                            <Badge variant="secondary" className="text-xs">Principal</Badge>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No hay colores asignados</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Dates */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Fechas Importantes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm font-medium text-blue-700">Fecha de Adquisición</p>
                                            <p className="text-sm font-semibold text-blue-900">
                                                {foundItem.acquisitionDate ? format(new Date(foundItem.acquisitionDate), "PPP", { locale: es }) : "N/A"}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm font-medium text-green-700">Fecha de Garantía</p>
                                            <p className="text-sm font-semibold text-green-900">
                                                {foundItem.warrantyDate ? format(new Date(foundItem.warrantyDate), "PPP", { locale: es }) : "N/A"}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-lg">
                                            <p className="text-sm font-medium text-orange-700">Fecha de Expiración</p>
                                            <p className="text-sm font-semibold text-orange-900">
                                                {foundItem.expirationDate ? format(new Date(foundItem.expirationDate), "PPP", { locale: es }) : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Special Characteristics */}
                            {(foundItem.critical || foundItem.dangerous || foundItem.requiresSpecialHandling || foundItem.perishable) && (
                                <Card className="border-orange-200 bg-orange-50/30">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-orange-800">
                                            <AlertTriangle className="h-5 w-5" />
                                            Características Especiales
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {foundItem.critical && (
                                                <Badge variant="destructive" className="text-xs">
                                                    <Shield className="h-3 w-3 mr-1" />
                                                    Crítico
                                                </Badge>
                                            )}
                                            {foundItem.dangerous && (
                                                <Badge variant="destructive" className="text-xs">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Peligroso
                                                </Badge>
                                            )}
                                            {foundItem.requiresSpecialHandling && (
                                                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                                    <Shield className="h-3 w-3 mr-1" />
                                                    Manejo Especial
                                                </Badge>
                                            )}
                                            {foundItem.perishable && (
                                                <Badge className="bg-red-100 text-red-800 text-xs">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Perecedero
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Observations */}
                            {foundItem.observations && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Observaciones
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {foundItem.observations}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
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
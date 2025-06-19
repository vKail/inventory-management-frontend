import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, QrCode, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";

interface LoanScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanComplete?: (item: InventoryItem | null) => void;
}

export function LoanScanModal({ isOpen, onClose, onScanComplete }: LoanScanModalProps) {
    const { getInventoryItemByCode } = useInventoryStore();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedCode, setScannedCode] = useState("");
    const [error, setError] = useState("");
    const [isReadyToSearch, setIsReadyToSearch] = useState(false);
    const [manualInput, setManualInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const barcodeBuffer = useRef("");
    const lastKeyTime = useRef(0);

    useEffect(() => {
        if (!isOpen) {
            setIsScanning(false);
            setScannedCode("");
            setError("");
            setIsReadyToSearch(false);
            setManualInput("");
            barcodeBuffer.current = "";
            return;
        }

        if (scannedCode) {
            handleScan(scannedCode);
        } else {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }

        const handleKeyPress = (event: KeyboardEvent) => {
            const currentTime = new Date().getTime();

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
    }, [isOpen, scannedCode]);

    const handleScan = async (code: string) => {
        if (!code) return;

        setIsScanning(true);
        setError("");

        try {
            const item = await getInventoryItemByCode(code);

            if (item) {
                if (!item.availableForLoan) {
                    setError("Este item no está disponible para préstamo");
                    onScanComplete?.(null);
                    return;
                }
                onScanComplete?.(item);
                onClose();
            } else {
                setError(`No se ha encontrado un producto con el código ${code}`);
                onScanComplete?.(null);
            }
        } catch (error) {
            console.error('Scan error:', error);
            setError("Error al buscar el producto");
            onScanComplete?.(null);
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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-xl font-semibold flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-2">
                        <QrCode className="h-5 w-5" />
                        <span>Escáner de Préstamo</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogTitle>

                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="w-full space-y-4">
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
                            </div>
                        </form>

                        {error && (
                            <div className="text-sm text-red-500 text-center">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 
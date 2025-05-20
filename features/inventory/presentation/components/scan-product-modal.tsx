"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, Pencil, X as XIcon } from "lucide-react";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";

interface ScanProductModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: (product: InventoryItem) => void;
}

export const ScanProductModal = ({ open, onClose, onEdit }: ScanProductModalProps) => {
  const [code, setCode] = useState("");
  const [scannedProduct, setScannedProduct] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items } = useInventoryStore();

  useEffect(() => {
    if (open) {
      setCode("");
      setScannedProduct(null);
      setLoading(false);
      setCopied(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    if (code.length >= 3) {
      setLoading(true);
      const timeout = setTimeout(() => {
        const found = items.find(
          (item) => item.barcode.toLowerCase() === code.trim().toLowerCase()
        );
        setScannedProduct(found || null);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [code, items]);

  const handleCopy = () => {
    if (!scannedProduct) return;
    const productInfo = `
Nombre: ${scannedProduct.name}
Descripción: ${scannedProduct.description}
Código: ${scannedProduct.barcode}
Categoría: ${scannedProduct.category}
Departamento: ${scannedProduct.department}
Cantidad: ${scannedProduct.quantity}
Estado: ${scannedProduct.status}`.trim();

    navigator.clipboard.writeText(productInfo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escaneando producto...</DialogTitle>
        </DialogHeader>

        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Buscando producto...</p>
            </div>
          ) : scannedProduct ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.name}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.description}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Código</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.barcode}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.category}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Departamento</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.department}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.quantity}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Estado</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  value={scannedProduct.status}
                  readOnly
                />
              </div>
            </div>
          ) : code.length >= 3 ? (
            <div className="text-center text-destructive text-sm py-4">
              Producto no encontrado.
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              Esperando escaneo...
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center gap-1"
          >
            <XIcon size={16} />
            Cancelar
          </Button>

          {scannedProduct && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex items-center gap-1"
              >
                <Copy size={16} />
                {copied ? "Copiado" : "Copiar"}
              </Button>

              <Button
                onClick={() => {
                  onEdit(scannedProduct);
                  onClose();
                }}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Pencil size={16} />
                Editar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

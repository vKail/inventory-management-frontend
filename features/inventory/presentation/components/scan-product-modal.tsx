"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, X as XIcon } from "lucide-react";
import { useInventoryStore } from "@/features/inventory/context/inventory-store";
import { toast } from "sonner";
import { InventoryItem } from "@/features/inventory/data/interfaces/inventory.interface";

interface ScanProductModalProps {
  open: boolean;
  onClose: () => void;
  onEdit: (product: InventoryItem) => void;
}

export const ScanProductModal = ({ open, onClose, onEdit }: ScanProductModalProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getInventoryItemByCode } = useInventoryStore();
  const timeoutRef = useRef<NodeJS.Timeout>(null!);

  useEffect(() => {
    if (open) {
      setCode("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open]);

  useEffect(() => {
    if (code.length >= 3) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setLoading(true);
      timeoutRef.current = setTimeout(async () => {
        try {
          const product = await getInventoryItemByCode(code);
          if (product) {
            onEdit(product);
            onClose();
          } else {
            toast.error("Producto no encontrado");
            setCode("");
            onClose();
          }
        } catch (error) {
          toast.error("Error al buscar el producto");
          setCode("");
        } finally {
          setLoading(false);
        }
      }, 1500); // 1.5 segundos de espera
    }
  }, [code, getInventoryItemByCode, onClose, onEdit]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Escaneando producto...</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2 border rounded opacity-0 absolute"
            placeholder="Escanear código"
            disabled={loading}
          />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Buscando producto...</p>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg font-medium mb-2">Listo para escanear</p>
              <p className="text-sm">Escanee el código de barras del producto</p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <XIcon size={16} className="mr-2" />
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
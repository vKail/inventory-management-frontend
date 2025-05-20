"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanModalProps {
  open: boolean;
  onClose: () => void;
  onScanComplete: (barcode: string) => void;
}

export const ScanModal = ({
  open,
  onClose,
  onScanComplete,
}: ScanModalProps) => {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setBarcode("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (barcode.trim().length >= 5) {
      setLoading(true);

      const timeout = setTimeout(() => {
        const sanitized = barcode.trim();
        onScanComplete(sanitized);
        onClose();
        setLoading(false);
      }, 700);

      return () => clearTimeout(timeout);
    }
  }, [barcode, onClose, onScanComplete]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ScanBarcode className="h-5 w-5 text-primary" />
            Escaneando código del bien
          </DialogTitle>
        </DialogHeader>

        {/* Input oculto para capturar automáticamente el escaneo */}
        <input
          ref={inputRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          className="absolute opacity-0 pointer-events-none"
          type="text"
          autoFocus
        />

        <div className="text-center py-6">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
          ) : (
            <p className="text-muted-foreground">
              Esperando escaneo del código de barras...
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
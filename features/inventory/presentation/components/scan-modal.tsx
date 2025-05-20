"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface ScanModalProps {
  open: boolean;
  onClose: () => void;
  onScanComplete: (code: string) => void;
}

export const ScanModal = ({ open, onClose, onScanComplete }: ScanModalProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCode("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (code.length >= 3) {
      setLoading(true);
      const timeout = setTimeout(() => {
        onScanComplete(code.trim());
        setLoading(false);
        onClose();
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [code, onScanComplete, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Escaneando código...</DialogTitle>
        </DialogHeader>
        <input
          ref={inputRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />
        <div className="text-center py-6">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
          ) : (
            <p className="text-muted-foreground">Esperando escaneo...</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

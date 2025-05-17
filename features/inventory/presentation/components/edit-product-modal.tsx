"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InventoryItem, ProductStatus } from "@/features/inventory/data/interfaces/inventory.interface";
import { Button } from "@/components/ui/button";
import { Copy, Check, X as XIcon } from "lucide-react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: InventoryItem | null;
  onSave: (updatedProduct: InventoryItem) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const emptyProduct: InventoryItem = {
    id: "",
    name: "",
    description: "",
    barcode: "",
    category: "",
    department: "",
    quantity: 0,
    status: ProductStatus.AVAILABLE,
    imageUrl: "",
    cost: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const [formData, setFormData] = useState<InventoryItem>(emptyProduct);
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setIsDirty(false);
      setCopied(false);
    } else {
      setFormData(emptyProduct);
      setIsDirty(false);
      setCopied(false);
    }
  }, [product]);

  const handleChange = <K extends keyof InventoryItem>(
    key: K,
    value: InventoryItem[K]
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      const dirty = Object.keys(newData).some((k) => {
        // @ts-ignore
        return newData[k] !== (product ? product[k] : emptyProduct[k]);
      });
      setIsDirty(dirty);
      return newData;
    });
    setCopied(false);
  };

  const handleCopyToClipboard = () => {
    const productInfo = `
Nombre: ${formData.name || ""}
Descripción: ${formData.description || ""}
Código: ${formData.barcode || ""}
Categoría: ${formData.category || ""}
Departamento: ${formData.department || ""}
Cantidad: ${formData.quantity}
Estado: ${formData.status}`.trim();

    navigator.clipboard.writeText(productInfo).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSave = () => {
    onSave(formData);
    setIsDirty(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData(product || emptyProduct);
    setIsDirty(false);
    onClose();
  };

  const statusOptions = Object.values(ProductStatus);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (isDirty) handleSave();
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Descripción del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Código</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.barcode}
              onChange={(e) => handleChange("barcode", e.target.value)}
              placeholder="Código del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              placeholder="Categoría"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="Departamento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cantidad</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", Number(e.target.value))}
              placeholder="Cantidad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value as ProductStatus)}
            >
              {statusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1"
            >
              <XIcon size={16} />
              Cancelar
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-1"
              >
                <Copy size={16} />
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button
                type="submit"
                disabled={!isDirty}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Check size={16} />
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

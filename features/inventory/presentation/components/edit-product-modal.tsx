"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InventoryItem, ProductStatus, ProductCategory, Department } from "@/features/inventory/data/interfaces/inventory.interface";
import { Button } from "@/components/ui/button";
import { Copy, Check, X as XIcon } from "lucide-react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: InventoryItem | null;
  onSave: (updatedProduct: InventoryItem, originalProduct: InventoryItem) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const emptyProduct: InventoryItem = {
    id: 0,
    name: "",
    description: "",
    barcode: "",
    category: ProductCategory.TECHNOLOGY,
    department: Department.COMPUTING,
    quantity: 0,
    status: ProductStatus.AVAILABLE,
    imageUrl: undefined,
    cost: undefined,
    createdAt: undefined,
    updatedAt: undefined,
    itemTypeId: undefined,
    normativeType: undefined,
    origin: undefined,
    locationId: undefined,
    custodianId: undefined,
    availableForLoan: undefined,
    identifier: undefined,
    previousCode: undefined,
    certificateId: undefined,
    conditionId: undefined,
    entryOrigin: undefined,
    entryType: undefined,
    acquisitionDate: undefined,
    commitmentNumber: undefined,
    modelCharacteristics: undefined,
    brandBreedOther: undefined,
    identificationSeries: undefined,
    warrantyDate: undefined,
    dimensions: undefined,
    critical: undefined,
    dangerous: undefined,
    requiresSpecialHandling: undefined,
    perishable: undefined,
    expirationDate: undefined,
    itemLine: undefined,
    accountingAccount: undefined,
    observations: undefined,
    activeCustodian: undefined,
    registrationUserId: undefined,
  };

  const [formData, setFormData] = useState<InventoryItem>(emptyProduct);
  const [originalData, setOriginalData] = useState<InventoryItem | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setOriginalData({ ...product }); // Almacena el estado original
      setIsDirty(false);
      setCopied(false);
    } else {
      setFormData(emptyProduct);
      setOriginalData(null);
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
        const originalValue = originalData ? originalData[k as keyof InventoryItem] : emptyProduct[k as keyof InventoryItem];
        return newData[k as keyof InventoryItem] !== originalValue;
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
    if (originalData) {
      onSave(formData, originalData);
    }
    setIsDirty(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData(product || emptyProduct);
    setIsDirty(false);
    onClose();
  };

  const statusOptions = Object.values(ProductStatus);
  const categoryOptions = Object.values(ProductCategory);
  const departmentOptions = Object.values(Department);

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent
        className="max-w-md"
        aria-describedby="edit-product-description"
      >
        <DialogHeader>
          <DialogTitle>Editar producto</DialogTitle>
        </DialogHeader>
        <p id="edit-product-description" className="text-sm text-gray-500 mb-4">
          Edite los detalles del producto a continuación.
        </p>

        <div className="space-y-3">
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
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value as ProductCategory)}
            >
              {categoryOptions.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value as Department)}
            >
              {departmentOptions.map((departmentOption) => (
                <option key={departmentOption} value={departmentOption}>
                  {departmentOption}
                </option>
              ))}
            </select>
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
                type="button"
                onClick={handleSave}
                disabled={!isDirty}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Check size={16} />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
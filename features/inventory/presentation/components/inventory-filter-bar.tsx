"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { InventoryFilters } from "@/features/inventory/data/interfaces/inventory.interface";
import { useState } from "react";

interface Props {
  onFilterChange: (filters: InventoryFilters) => void;
  onClear: () => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export const InventoryFilterBar = ({
  onFilterChange,
  onClear,
  viewMode,
  setViewMode,
}: Props) => {
  const [filters, setFilters] = useState<InventoryFilters>({
    search: "",
    category: "",
    department: "",
    state: "",
  });

  const handleChange = (field: keyof InventoryFilters, value: string) => {
    const updatedFilters = {
      ...filters,
      [field]: value === "all" ? "" : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="font-medium">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <Input
          placeholder="Buscar producto..."
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
        />

        <Select
          value={filters.category || "all"}
          onValueChange={(value) => handleChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="technology">Tecnología</SelectItem>
            <SelectItem value="electronics">Electrónica</SelectItem>
            <SelectItem value="furniture">Muebles</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.department || "all"}
          onValueChange={(value) => handleChange("department", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los departamentos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los departamentos</SelectItem>
            <SelectItem value="computing">Computación</SelectItem>
            <SelectItem value="electronics">Electrónica</SelectItem>
            <SelectItem value="design">Diseño</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.state || "all"}
          onValueChange={(value) => handleChange("state", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="in_use">En uso</SelectItem>
            <SelectItem value="maintenance">En mantenimiento</SelectItem>
            <SelectItem value="damaged">Dañado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" onClick={onClear}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
};
// src/app/inventory/components/InventoryFilters.tsx

import { Input } from "@/shared/components/Input";
import Select from "@/shared/components/Select";

interface InventoryFiltersProps {
  filters: { category: string; search: string };
  onFilterChange: (filters: { category: string; search: string }) => void;
}

export const InventoryFilters = ({ filters, onFilterChange }: InventoryFiltersProps) => {
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: event.target.value });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  const categoryOptions = [
    { value: "", label: "Todas las Categorías" },
    { value: "electronics", label: "Electrónica" },
    { value: "furniture", label: "Muebles" },
    { value: "clothing", label: "Ropa" },
  ];

  return (
    <div className="flex gap-4 mb-6">
      <Select
        label="Categoría"
        value={filters.category}
        onChange={handleCategoryChange}
        options={categoryOptions}
      />

      <Input
        placeholder="Buscar producto..."
        value={filters.search}
        onChange={handleSearchChange}
      />
    </div>
  );
};
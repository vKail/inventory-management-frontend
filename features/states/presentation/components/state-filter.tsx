"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  maintenanceFilter: string;
  onMaintenanceChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export default function StateFilter({
  search,
  onSearchChange,
  maintenanceFilter,
  onMaintenanceChange,
  statusFilter,
  onStatusChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto py-2 mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre o descripción..."
        className="border rounded px-3 py-2 text-sm w-full md:w-64"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select value={maintenanceFilter} onValueChange={onMaintenanceChange}>
        <SelectTrigger className="w-full md:w-56">
          <SelectValue placeholder="Todos los mantenimientos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los mantenimientos</SelectItem>
          <SelectItem value="required">Requiere mantenimiento</SelectItem>
          <SelectItem value="not_required">No requiere mantenimiento</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-56">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="active">Activos</SelectItem>
          <SelectItem value="inactive">Inactivos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

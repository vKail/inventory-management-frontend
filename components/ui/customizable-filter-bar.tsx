import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Combobox } from "./combobox";
import { Settings2, FilterX } from "lucide-react";

const ALL_FILTERS = [
    { key: "categoryId", label: "Categoría" },
    { key: "locationId", label: "Ubicación" },
    { key: "itemTypeId", label: "Tipo de Item" },
    { key: "statusId", label: "Estado" },
    { key: "conditionId", label: "Condición" },
    { key: "custodianId", label: "Custodio" },
    { key: "normativeType", label: "Tipo Normativo" },
    { key: "entryOrigin", label: "Origen de Entrada" },
];

const LOCAL_STORAGE_KEY = "inventory-custom-filters";

export interface CustomizableFilterBarProps {
    availableOptions: Record<string, { value: string; label: string }[]>;
    filters: Record<string, string>;
    onChange: (filters: Record<string, string>) => void;
    onClearFilters?: () => void;
    hasActiveFilters?: boolean;
    // availableOptions.entryOrigin must only have PURCHASE and LOAN
    // availableOptions.normativeType must only have PROPERTY, ADMINISTRATIVE_CONTROL, INVENTORY
    // availableOptions.custodianId must be provided by parent (from user-store)
}

export const CustomizableFilterBar: React.FC<CustomizableFilterBarProps> = ({
    availableOptions,
    filters,
    onChange,
    onClearFilters,
    hasActiveFilters,
}) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>(["categoryId", "locationId", "itemTypeId"]);
    const [editMode, setEditMode] = useState(false);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.every(f => typeof f === "string")) {
                    setSelectedFilters(parsed);
                }
            } catch { }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedFilters));
    }, [selectedFilters]);

    // Handle filter value change
    const handleFilterChange = (key: string, value: string) => {
        onChange({ ...filters, [key]: value });
    };

    // Edit modal logic
    const [editSelection, setEditSelection] = useState<string[]>(selectedFilters);

    const handleAddFilter = (key: string) => {
        if (editSelection.length < 3 && !editSelection.includes(key)) {
            setEditSelection([...editSelection, key]);
        }
    };
    const handleRemoveFilter = (key: string) => {
        setEditSelection(editSelection.filter(f => f !== key));
    };
    const handleMoveUp = (idx: number) => {
        if (idx === 0) return;
        const arr = [...editSelection];
        [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
        setEditSelection(arr);
    };
    const handleMoveDown = (idx: number) => {
        if (idx === editSelection.length - 1) return;
        const arr = [...editSelection];
        [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
        setEditSelection(arr);
    };
    const handleSave = () => {
        setSelectedFilters(editSelection);
        setEditMode(false);
    };
    const handleCancel = () => {
        setEditSelection(selectedFilters);
        setEditMode(false);
    };

    return (
        <div className="flex gap-2 items-center">
            {selectedFilters.map((key) => {
                const filterMeta = ALL_FILTERS.find(f => f.key === key);
                if (!filterMeta) return null;
                return (
                    <div key={key} className="min-w-[120px] max-w-[200px] flex-1">
                        <Combobox
                            options={availableOptions[key] || []}
                            value={filters[key] ? String(filters[key]) : ""}
                            onChange={val => handleFilterChange(key, String(val))}
                            placeholder={filterMeta.label}
                            searchPlaceholder={`Buscar ${filterMeta.label.toLowerCase()}...`}
                            emptyMessage={`No se encontraron ${filterMeta.label.toLowerCase()}s`}
                        />
                    </div>
                );
            })}
            <Button variant="ghost" size="icon" onClick={() => setEditMode(true)} title="Editar filtros">
                <Settings2 className="h-5 w-5" />
            </Button>
            {onClearFilters && hasActiveFilters && (
                <Button variant="ghost" size="icon" onClick={onClearFilters} title="Limpiar filtros">
                    <FilterX className="h-5 w-5" />
                </Button>
            )}
            {editMode && (
                <div className="border p-4 rounded bg-white shadow-md z-50 absolute">
                    <h4 className="font-bold mb-2">Personalizar Filtros</h4>
                    <div className="flex flex-col gap-2 mb-2">
                        {editSelection.map((key, idx) => {
                            const filterMeta = ALL_FILTERS.find(f => f.key === key);
                            return (
                                <div key={key} className="flex items-center gap-2">
                                    <span>{filterMeta?.label}</span>
                                    <Button size="icon" variant="ghost" onClick={() => handleMoveUp(idx)} disabled={idx === 0}>↑</Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleMoveDown(idx)} disabled={idx === editSelection.length - 1}>↓</Button>
                                    <Button size="icon" variant="default" onClick={() => handleRemoveFilter(key)}>✕</Button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mb-2">
                        <span className="font-semibold">Agregar filtro:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {ALL_FILTERS.filter(f => !editSelection.includes(f.key)).map(f => (
                                <Button key={f.key} size="sm" variant="secondary" onClick={() => handleAddFilter(f.key)} disabled={editSelection.length >= 3}>
                                    {f.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Button onClick={handleSave} variant="default" size="sm">Guardar</Button>
                        <Button onClick={handleCancel} variant="outline" size="sm">Cancelar</Button>
                    </div>
                </div>
            )}
        </div>
    );
}; 
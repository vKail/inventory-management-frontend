"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ReportRow } from '@/features/reports/data/interfaces/report.interface';
import { reportLocationService } from '@/features/reports/services/location.service';
import { Combobox } from '@/components/ui/combobox';

export default function ReportList({
    rows,
    onApplyLocation,
    onRemoveRow,
}: {
    rows: ReportRow[];
    onApplyLocation: (code: string, locationId: number, locationName?: string) => void;
    onRemoveRow: (code: string) => void;
}) {
    const [locationOptions, setLocationOptions] = useState<Array<{ value: number; label: string }>>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bulkLocationId, setBulkLocationId] = useState<number>(0);

    const filteredRows = rows.filter(r => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (
            String(r.code).toLowerCase().includes(q) ||
            String(r.name).toLowerCase().includes(q) ||
            String(r.location ?? '').toLowerCase().includes(q)
        );
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const items = await reportLocationService.getLocations();
                if (!mounted) return;
                const opts = (items || []).map((it: any) => ({ value: it.id ?? 0, label: it.name ?? '' }));
                setLocationOptions(opts);
            } catch (e) {
                console.error('Error loading locations for report combobox', e);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Buscar en la lista..."
                        className="border rounded px-2 py-1 w-64"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <div className="w-64">
                        <Combobox
                            options={locationOptions}
                            value={bulkLocationId}
                            onChange={(val: string | number) => {
                                const id = Number(val);
                                if (isNaN(id) || id <= 0) {
                                    setBulkLocationId(0);
                                    return;
                                }
                                setBulkLocationId(id);
                                const selected = locationOptions.find(o => o.value === id);
                                // apply to all rows that don't already have this location
                                rows.forEach(r => {
                                    if ((r.locationId ?? 0) !== id) {
                                        onApplyLocation(r.code, id, selected?.label);
                                    }
                                });
                            }}
                            placeholder="Cambiar ubicación a todos"
                            searchPlaceholder="Buscar ubicación..."
                            emptyMessage="No se encontraron ubicaciones"
                            fieldName={`bulk-location`}
                        />
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">{filteredRows.length} / {rows.length} items</div>
            </div>

            <div className="overflow-x-auto">
                <div className="max-h-[48vh] overflow-y-auto border rounded">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="text-left">
                                <th className="p-2">Código</th>
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Ubicación</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map(r => (
                                <ReportRowItem
                                    key={r.code}
                                    row={r}
                                    onApplyLocation={onApplyLocation}
                                    onRemoveRow={onRemoveRow}
                                    locationOptions={locationOptions}
                                />
                            ))}

                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                        No hay productos escaneados aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ReportRowItem({
    row,
    onApplyLocation,
    onRemoveRow,
    locationOptions,
}: {
    row: ReportRow;
    onApplyLocation: (code: string, locationId: number, locationName?: string) => void;
    onRemoveRow: (code: string) => void;
    locationOptions: Array<{ value: number; label: string }>;
}) {
    const [value, setValue] = useState(row.location ?? '');

    useEffect(() => {
        setValue(row.location ?? '');
    }, [row.location]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // intentar parsear número de locationId si el usuario ingresó id
            const asId = Number(value);
            if (!isNaN(asId) && asId > 0) {
                onApplyLocation(row.code, asId, value);
            } else {
                // si no es numérico, igual enviamos 0 y la cadena como nombre (backend puede requerir id)
                onApplyLocation(row.code, 0, value);
            }
        }
    };

    const handleBlur = () => {
        const asId = Number(value);
        if (!isNaN(asId) && asId > 0) {
            onApplyLocation(row.code, asId, value);
        } else {
            onApplyLocation(row.code, 0, value);
        }
    };

    return (
        <tr className="border-t">
            <td className="p-2 align-top">{row.code}</td>
            <td className="p-2 align-top">{row.name}</td>
            <td className="p-2 align-top">
                <div>
                    <Combobox
                        options={locationOptions}
                        value={row.locationId ?? 0}
                        onChange={(val: string | number) => {
                            const id = Number(val);
                            if (!isNaN(id) && id > 0) {
                                const selected = locationOptions.find(o => o.value === id);
                                onApplyLocation(row.code, id, selected?.label);
                                setValue(selected?.label ?? '');
                            }
                        }}
                        placeholder="Seleccionar ubicación"
                        searchPlaceholder="Buscar ubicación..."
                        emptyMessage="No se encontraron ubicaciones"
                        fieldName={`locationId-${row.code}`}
                    />
                </div>
            </td>
            <td className="p-2 align-top">
                <button className="text-sm text-destructive" onClick={() => onRemoveRow(row.code)}>
                    Eliminar
                </button>
            </td>
        </tr>
    );
}
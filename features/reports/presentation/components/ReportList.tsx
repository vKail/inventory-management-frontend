"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ReportRow, ReportType } from '@/features/reports/data/interfaces/report.interface';
import { reportLocationService } from '@/features/reports/services/location.service';
import { reportCustodianService } from '@/features/reports/services/custodian.service';
import { Combobox } from '@/components/ui/combobox';

export default function ReportList({
    rows,
    onApplyLocation,
    onApplyCustodian,
    onRemoveRow,
    reportType = 'area',
}: {
    rows: ReportRow[];
    onApplyLocation?: (code: string, locationId: number, locationName?: string) => void;
    onApplyCustodian?: (code: string, custodianId: number, custodianName?: string) => void;
    onRemoveRow: (code: string) => void;
    reportType?: ReportType;
}) {
    const [locationOptions, setLocationOptions] = useState<Array<{ value: number; label: string }>>([]);
    const [custodianOptions, setCustodianOptions] = useState<Array<{ value: number; label: string }>>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [bulkLocationId, setBulkLocationId] = useState<number>(0);
    const [bulkCustodianId, setBulkCustodianId] = useState<number>(0);

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
                if (reportType === 'area' || !reportType) {
                    const items = await reportLocationService.getLocations();
                    if (!mounted) return;
                    const opts = (items || []).map((it: any) => ({ value: it.id ?? 0, label: it.name ?? '' }));
                    setLocationOptions(opts);
                } else if (reportType === 'custodian-handover') {
                    const custodians = await reportCustodianService.getCustodians();
                    if (!mounted) return;
                    const opts = custodians.map((c: any) => ({
                        value: c.id,
                        label: c.dni ? `${c.name} (${c.dni})` : c.name
                    }));
                    setCustodianOptions(opts);
                }
            } catch (e) {
                console.error('Error loading options for report', e);
            }
        })();
        return () => { mounted = false; };
    }, [reportType]);

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
                    {reportType === 'area' && onApplyLocation && (
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
                    )}
                    {reportType === 'custodian-handover' && onApplyCustodian && (
                        <div className="w-64">
                            <Combobox
                                options={custodianOptions}
                                value={bulkCustodianId}
                                onChange={(val: string | number) => {
                                    const id = Number(val);
                                    if (isNaN(id) || id <= 0) {
                                        setBulkCustodianId(0);
                                        return;
                                    }
                                    setBulkCustodianId(id);
                                    const selected = custodianOptions.find(o => o.value === id);
                                    // apply to all rows that don't already have this custodian
                                    rows.forEach(r => {
                                        if ((r.newCustodianId ?? 0) !== id) {
                                            onApplyCustodian(r.code, id, selected?.label);
                                        }
                                    });
                                }}
                                placeholder="Asignar custodio a todos"
                                searchPlaceholder="Buscar custodio..."
                                emptyMessage="No se encontraron custodios"
                                fieldName={`bulk-custodian`}
                            />
                        </div>
                    )}
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
                                {reportType === 'area' && <th className="p-2">Ubicación</th>}
                                {reportType === 'custodian-handover' && (
                                    <>
                                        <th className="p-2">Custodio Actual</th>
                                        <th className="p-2">Nuevo Custodio</th>
                                    </>
                                )}
                                {reportType === 'reconciliation' && (
                                    <>
                                        <th className="p-2">Ubicación</th>
                                        <th className="p-2">Condición</th>
                                        <th className="p-2">Stock</th>
                                        <th className="p-2">Estado</th>
                                    </>
                                )}
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map(r => (
                                <ReportRowItem
                                    key={r.code}
                                    row={r}
                                    onApplyLocation={onApplyLocation}
                                    onApplyCustodian={onApplyCustodian}
                                    onRemoveRow={onRemoveRow}
                                    locationOptions={locationOptions}
                                    custodianOptions={custodianOptions}
                                    reportType={reportType}
                                />
                            ))}

                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={reportType === 'custodian-handover' ? 5 : reportType === 'reconciliation' ? 7 : 4} className="p-4 text-center text-muted-foreground">
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
    onApplyCustodian,
    onRemoveRow,
    locationOptions,
    custodianOptions,
    reportType,
}: {
    row: ReportRow;
    onApplyLocation?: (code: string, locationId: number, locationName?: string) => void;
    onApplyCustodian?: (code: string, custodianId: number, custodianName?: string) => void;
    onRemoveRow: (code: string) => void;
    locationOptions: Array<{ value: number; label: string }>;
    custodianOptions?: Array<{ value: number; label: string }>;
    reportType?: ReportType;
}) {
    const [value, setValue] = useState(row.location ?? '');

    useEffect(() => {
        setValue(row.location ?? '');
    }, [row.location]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onApplyLocation) {
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
        if (onApplyLocation) {
            const asId = Number(value);
            if (!isNaN(asId) && asId > 0) {
                onApplyLocation(row.code, asId, value);
            } else {
                onApplyLocation(row.code, 0, value);
            }
        }
    };

    return (
        <tr className="border-t">
            <td className="p-2 align-top">
                <div className="flex items-center gap-2">
                    {row.code}
                    {row.isUnknown && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                            NO EN BD
                        </span>
                    )}
                </div>
            </td>
            <td className="p-2 align-top">
                {row.isUnknown ? (
                    <span className="text-orange-600 italic">Código no encontrado en base de datos</span>
                ) : (
                    row.name
                )}
            </td>
            {reportType === 'area' && onApplyLocation && (
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
            )}
            {reportType === 'custodian-handover' && (
                <>
                    <td className="p-2 align-top">
                        <div className="text-sm">{row.currentCustodian || 'N/A'}</div>
                    </td>
                    <td className="p-2 align-top">
                        {onApplyCustodian && custodianOptions && (
                            <Combobox
                                options={custodianOptions}
                                value={row.newCustodianId ?? 0}
                                onChange={(val: string | number) => {
                                    const id = Number(val);
                                    if (!isNaN(id) && id > 0) {
                                        const selected = custodianOptions.find(o => o.value === id);
                                        onApplyCustodian(row.code, id, selected?.label);
                                    }
                                }}
                                placeholder="Seleccionar nuevo custodio"
                                searchPlaceholder="Buscar custodio..."
                                emptyMessage="No se encontraron custodios"
                                fieldName={`custodianId-${row.code}`}
                            />
                        )}
                    </td>
                </>
            )}
            {reportType === 'reconciliation' && (
                <>
                    <td className="p-2 align-top">
                        <div className="text-sm">{row.location || 'N/A'}</div>
                    </td>
                    <td className="p-2 align-top">
                        <div className="text-sm">{row.condition || 'N/A'}</div>
                    </td>
                    <td className="p-2 align-top">
                        <div className="text-sm font-medium">{row.stock ?? 0}</div>
                    </td>
                    <td className="p-2 align-top">
                        {row.isUnknown ? (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-medium">
                                ⚠ Desconocido
                            </span>
                        ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                                ✓ Verificado
                            </span>
                        )}
                    </td>
                </>
            )}
            <td className="p-2 align-top">
                <button className="text-sm text-destructive" onClick={() => onRemoveRow(row.code)}>
                    Eliminar
                </button>
            </td>
        </tr>
    );
}
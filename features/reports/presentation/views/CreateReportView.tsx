"use client";

import React, { useMemo, useState } from 'react';
import ReportScanner from '../components/ReportScanner';
import ReportList from '../components/ReportList';
import { Button } from '@/shared/components/ui/Button';
import { useReport } from '@/features/reports/hooks/useReport';
import { useAuthStore } from '@/features/auth/context/auth-store';
import { generateAreaReportPDF } from '@/features/reports/services/report-pdf.service';

export default function CreateReportView() {
    const { rows, scanCode, removeRow, clearRows, updateLocation, loading, lastAdded, error } = useReport();
    const authUser = useAuthStore(state => state.user);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [manualCode, setManualCode] = useState('');
    const [createdBy, setCreatedBy] = useState(authUser?.userName ?? '');

    const handleDownload = async () => {
        try {
            // determine location name: if all rows share same non-empty location use it, otherwise blank
            let locationName = '';
            if (rows.length > 0) {
                const firstLoc = rows[0].location ?? '';
                const allSame = rows.every(r => (r.location ?? '') === firstLoc && firstLoc !== '');
                if (allSame) locationName = firstLoc;
            }

            await generateAreaReportPDF(rows, { title: 'Reporte de Área', createdBy: createdBy, locationName });
        } catch (error) {
            console.error('Error generando PDF', error);
        }
    };

    const reportTypes = useMemo(
        () => [
            { id: 'area', title: 'Reporte de Área', description: 'Escanear productos por área' },
        ],
        []
    );

    const handleManualSubmit = async () => {
        if (!manualCode) return;
        await scanCode(manualCode.trim());
        setManualCode('');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Seleccione el tipo de Reporte</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {reportTypes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setActiveType(t.id)}
                            className={`p-4 rounded border ${activeType === t.id ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                            <div className="font-medium">{t.title}</div>
                            <div className="text-sm text-muted-foreground">{t.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {activeType && (
                <div className="border rounded p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-md font-semibold">{reportTypes.find(r => r.id === activeType)?.title}</h3>
                            <div className="text-sm text-muted-foreground">Escuche el escáner y agregue productos a la lista</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={() => clearRows()} size="sm">Limpiar</Button>
                            <div className="text-sm">
                                <div className="text-muted-foreground">Creado por</div>
                                <div className="font-medium">{createdBy || 'Usuario'}</div>
                            </div>
                            <Button onClick={handleDownload} size="sm">Descargar reporte</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-center">
                                <ReportScanner onCode={(code) => scanCode(code)} />
                                <div className="flex gap-2">
                                    <input
                                        placeholder="Ingresar código manualmente"
                                        className="border rounded px-2 py-1"
                                        value={manualCode}
                                        onChange={e => setManualCode(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleManualSubmit(); }}
                                    />
                                    <Button size="sm" onClick={handleManualSubmit} disabled={!manualCode || loading}>Agregar</Button>
                                </div>
                            </div>

                            <div className="p-3 border rounded">
                                {error ? (
                                    <div className="text-sm text-destructive">{error}</div>
                                ) : lastAdded ? (
                                    <div>
                                        <div className="text-sm text-muted-foreground">Último item registrado</div>
                                        <div className="mt-2 font-medium">{lastAdded.code} — {lastAdded.name}</div>
                                        <div className="text-sm">Ubicación: {lastAdded.location}</div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">Último item registrado: ninguno todavía</div>
                                )}
                            </div>

                            <ReportList rows={rows} onApplyLocation={(code, locationId, locationName) => updateLocation(code, locationId, locationName)} onRemoveRow={removeRow} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

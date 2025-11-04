"use client";

import React, { useEffect, useRef } from 'react';

export default function ReportScanner({ onCode }: { onCode: (code: string) => void }) {
    const bufferRef = useRef('');
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Enter -> flush buffer
            if (e.key === 'Enter') {
                const code = bufferRef.current.trim();
                bufferRef.current = '';
                if (code) onCode(code);
                return;
            }

            // Sólo imprimir caracteres
            if (e.key.length === 1) {
                bufferRef.current += e.key;
                if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
                timeoutRef.current = window.setTimeout(() => {
                    const code = bufferRef.current.trim();
                    bufferRef.current = '';
                    if (code) onCode(code);
                }, 80) as unknown as number;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onCode]);

    return (
        <div className="p-3 border rounded bg-muted/5">
            <div className="text-sm">Estado: escuchando el escáner (o escribe el código y presiona Enter)</div>
            <div className="text-xs text-muted-foreground mt-1">Se detectarán códigos automáticamente y se agregarán a la lista.</div>
        </div>
    );
}

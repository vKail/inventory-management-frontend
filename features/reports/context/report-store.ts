import { create } from 'zustand';
import { ReportRow } from '@/features/reports/data/interfaces/report.interface';
import { reportService } from '@/features/reports/services/report.service';
import { toast } from 'sonner';

interface ReportState {
    rows: ReportRow[];
    loading: boolean;
    error: string | null;
    lastAdded: ReportRow | null;
    setError: (msg: string | null) => void;
    addRow: (r: ReportRow) => void;
    removeRow: (code: string) => void;
    clearRows: () => void;
    fetchAndAddByCode: (code: string) => Promise<void>;
    updateLocationAndPersist: (code: string, locationId: number, locationName?: string) => Promise<void>;
}

export const useReportStore = create<ReportState>((set, get) => ({
    rows: [],
    loading: false,
    error: null,
    lastAdded: null,

    setError: (msg: string | null) => set({ error: msg }),

    addRow: (r) => set(state => ({ rows: [...state.rows, r], lastAdded: r })),

    removeRow: (code) => set(state => ({ rows: state.rows.filter(r => r.code !== code), lastAdded: state.lastAdded })),

    clearRows: () => set({ rows: [], lastAdded: null }),

    fetchAndAddByCode: async (code: string) => {
        const MIN_CODE_LENGTH = 6;
        set({ loading: true, error: null });

        if (!code || code.trim().length < MIN_CODE_LENGTH) {
            set({ loading: false, error: `Código demasiado corto (${MIN_CODE_LENGTH} dígitos mínimo)` });
            return;
        }

        try {
            const item = await reportService.getItemByCode(code);
            if (!item) {
                // Solo toast si no se encuentra
                toast.error(`Producto con código ${code} no encontrado`);
                set({ loading: false });
                return;
            }

            const row: ReportRow = {
                id: item.id,
                code: item.code ?? code,
                name: item.name ?? item.displayName ?? '',
                location: item.location?.name ?? (item.locationId ?? '') as any,
                locationId: item.locationId ?? null,
                scannedAt: new Date().toISOString(),
                raw: item,
            };

            const exists = get().rows.find(r => r.code === row.code);
            if (exists) {
                set({ loading: false, error: `Producto ${row.code} ya agregado` });
                return;
            }

            set(state => ({ rows: [...state.rows, row], loading: false, lastAdded: row, error: null }));
            // no toast de éxito por petición del usuario
        } catch (error: any) {
            console.error('fetchAndAddByCode error', error);
            set({ error: 'Error al buscar producto', loading: false });
            toast.error('Error al buscar producto');
        }
    },

    updateLocationAndPersist: async (code: string, locationId: number, locationName?: string) => {
        set({ loading: true, error: null });
        try {
            const row = get().rows.find(r => r.code === code);
            if (!row || !row.id) {
                toast.error('Item no encontrado en la lista para actualizar');
                set({ loading: false });
                return;
            }

            await reportService.updateItemLocation(row.id, locationId);

            // actualizar en store local
            set(state => ({
                rows: state.rows.map(r => (r.code === code ? { ...r, locationId, location: locationName ?? String(locationId) } : r)),
                loading: false,
                error: null,
            }));

            // no toast de éxito
        } catch (error) {
            console.error('updateLocationAndPersist error', error);
            set({ error: 'Error actualizando ubicación', loading: false });
            toast.error('Error al actualizar ubicación');
        }
    },
}));

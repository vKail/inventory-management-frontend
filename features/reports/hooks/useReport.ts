"use client";

import { useCallback } from 'react';
import { useReportStore } from '@/features/reports/context/report-store';

export function useReport() {
    const rows = useReportStore(state => state.rows);
    const loading = useReportStore(state => state.loading);
    const error = useReportStore(state => state.error);
    const lastAdded = useReportStore(state => state.lastAdded);
    const reportType = useReportStore(state => state.reportType);
    const setReportType = useReportStore(state => state.setReportType);
    const fetchAndAddByCode = useReportStore(state => state.fetchAndAddByCode);
    const addRow = useReportStore(state => state.addRow);
    const removeRow = useReportStore(state => state.removeRow);
    const clearRows = useReportStore(state => state.clearRows);
    const updateLocationAndPersist = useReportStore(state => state.updateLocationAndPersist);
    const updateCustodianAndPersist = useReportStore(state => state.updateCustodianAndPersist);
    const setError = useReportStore(state => state.setError);

    const scanCode = useCallback(async (code: string) => {
        return fetchAndAddByCode(code);
    }, [fetchAndAddByCode]);

    const manualAdd = useCallback((payload: { code: string; name?: string; location?: string }) => {
        // Prefer to perform a lookup (same as scan) so we validate and fetch full item
        fetchAndAddByCode(payload.code);
    }, [addRow]);

    const updateLocation = useCallback(async (code: string, locationId: number, locationName?: string) => {
        return updateLocationAndPersist(code, locationId, locationName);
    }, [updateLocationAndPersist]);

    const updateCustodian = useCallback(async (code: string, custodianId: number, custodianName?: string) => {
        return updateCustodianAndPersist(code, custodianId, custodianName);
    }, [updateCustodianAndPersist]);

    return {
        rows,
        loading,
        error,
        lastAdded,
        reportType,
        setReportType,
        scanCode,
        manualAdd,
        removeRow,
        clearRows,
        updateLocation,
        updateCustodian,
        setError,
    };
}

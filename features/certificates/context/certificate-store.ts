import { create } from 'zustand';
import { ICertificate } from '../data/interfaces/certificate.interface';
import { CertificateService } from '../services/certificate.service';
import { toast } from 'sonner';

interface CertificateStore {
    certificates: ICertificate[];
    filteredCertificates: ICertificate[];
    searchTerm: string;
    typeFilter: string;
    statusFilter: string;
    dateFilter: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getCertificates: (page?: number, limit?: number, filters?: { search?: string; type?: string; status?: string; dateFrom?: string; dateTo?: string }, allRecords?: boolean) => Promise<void>;
    getCertificateById: (certificateId: string) => Promise<ICertificate | undefined>;
    addCertificate: (certificate: Partial<ICertificate>) => Promise<void>;
    updateCertificate: (certificateId: string, certificate: Partial<ICertificate>) => Promise<void>;
    deleteCertificate: (certificateId: string) => Promise<void>;
    refreshTable: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    setTypeFilter: (type: string) => void;
    setStatusFilter: (status: string) => void;
    setDateFilter: (date: string) => void;
    clearFilters: () => void;
}

export const useCertificateStore = create<CertificateStore>((set, get) => ({
    certificates: [],
    filteredCertificates: [],
    searchTerm: '',
    typeFilter: 'all',
    statusFilter: 'all',
    dateFilter: '',
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,

    setSearchTerm: (term: string) => {
        set({ searchTerm: term });
        get().refreshTable();
    },

    setTypeFilter: (type: string) => {
        set({ typeFilter: type });
        get().refreshTable();
    },

    setStatusFilter: (status: string) => {
        set({ statusFilter: status });
        get().refreshTable();
    },

    setDateFilter: (date: string) => {
        set({ dateFilter: date });
        get().refreshTable();
    },

    clearFilters: () => {
        set({
            searchTerm: '',
            typeFilter: 'all',
            statusFilter: 'all',
            dateFilter: ''
        });
        get().refreshTable();
    },

    getCertificates: async (page = 1, limit = 10, filters?: { search?: string; type?: string; status?: string; dateFrom?: string; dateTo?: string }, allRecords?: boolean) => {
        try {
            set({ loading: true, error: null });
            // Construir query params solo con los filtros, sin page ni limit
            const queryParams = new URLSearchParams();
            // Agregar filtros si están presentes
            const searchTerm = filters?.search ?? get().searchTerm;
            const typeFilter = filters?.type ?? get().typeFilter;
            const statusFilter = filters?.status ?? get().statusFilter;
            const dateFrom = filters?.dateFrom;
            const dateTo = filters?.dateTo;
            if (searchTerm) queryParams.append('search', searchTerm);
            if (typeFilter && typeFilter !== 'all') queryParams.append('type', typeFilter);
            if (statusFilter && statusFilter !== 'all') queryParams.append('status', statusFilter);
            if (dateFrom) queryParams.append('dateFrom', dateFrom);
            if (dateTo) queryParams.append('dateTo', dateTo);
            const response = await CertificateService.getInstance().getCertificates(page, limit, queryParams.toString(), !!allRecords);
            set({
                certificates: response.records,
                filteredCertificates: response.records,
                currentPage: response.page,
                totalPages: response.pages,
                loading: false
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener las Actas";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    getCertificateById: async (certificateId: string) => {
        try {
            set({ loading: true, error: null });
            const certificate = await CertificateService.getInstance().getCertificateById(certificateId);
            set({ loading: false });
            return certificate;
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener el Acta";
            set({ error: message, loading: false });
            toast.error(message);
            return undefined;
        }
    },

    addCertificate: async (certificate: Partial<ICertificate>) => {
        try {
            set({ loading: true, error: null });
            await CertificateService.getInstance().createCertificate(certificate);
            await get().getCertificates(1, 10); // Reset to first page after adding
            toast.success('Acta creada exitosamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al crear el Acta";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    updateCertificate: async (certificateId: string, certificate: Partial<ICertificate>) => {
        try {
            set({ loading: true, error: null });
            await CertificateService.getInstance().updateCertificate(certificateId, certificate);
            await get().getCertificates(get().currentPage, 10); // Stay on current page after update
            toast.success('Acta actualizado exitosamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al actualizar el Acta";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    deleteCertificate: async (certificateId: string) => {
        try {
            set({ loading: true, error: null });
            await CertificateService.getInstance().deleteCertificate(certificateId);
            const { currentPage, certificates } = get();
            if (certificates.length === 1 && currentPage > 1) {
                // Si es el último item de la página actual y no es la primera página
                await get().getCertificates(currentPage - 1, 10);
            } else {
                // Refrescamos la página actual
                await get().getCertificates(currentPage, 10);
            }
            toast.success('Acta eliminado exitosamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al eliminar el Acta";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    refreshTable: async () => {
        const { currentPage } = get();
        await get().getCertificates(currentPage);
    }
})); 
import { create } from 'zustand';
import { ICertificate } from '../data/interfaces/certificate.interface';
import { CertificateService } from '../services/certificate.service';
import { toast } from 'sonner';

interface CertificateStore {
    certificates: ICertificate[];
    filteredCertificates: ICertificate[];
    searchTerm: string;
    typeFilter: string;
    dateFilter: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    getCertificates: (page?: number, limit?: number) => Promise<void>;
    getCertificateById: (certificateId: string) => Promise<ICertificate | undefined>;
    addCertificate: (certificate: Partial<ICertificate>) => Promise<void>;
    updateCertificate: (certificateId: string, certificate: Partial<ICertificate>) => Promise<void>;
    deleteCertificate: (certificateId: string) => Promise<void>;
    refreshTable: () => Promise<void>;
    setSearchTerm: (term: string) => void;
    setTypeFilter: (type: string) => void;
    setDateFilter: (date: string) => void;
    clearFilters: () => void;
}

export const useCertificateStore = create<CertificateStore>((set, get) => ({
    certificates: [],
    filteredCertificates: [],
    searchTerm: '',
    typeFilter: 'all',
    dateFilter: '',
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,

    setSearchTerm: (term: string) => {
        const { certificates, typeFilter, dateFilter } = get();
        const filtered = certificates.filter((certificate) => {
            const matchesSearch = certificate.number.toString().includes(term);
            const matchesType = typeFilter === 'all' || certificate.type === typeFilter;
            const matchesDate = dateFilter === '' || certificate.date === dateFilter;

            return matchesSearch && matchesType && matchesDate;
        });
        set({ searchTerm: term, filteredCertificates: filtered });
    },

    setTypeFilter: (type: string) => {
        const { certificates, searchTerm, dateFilter } = get();
        const filtered = certificates.filter((certificate) => {
            const matchesSearch = searchTerm === '' || certificate.number.toString().includes(searchTerm);
            const matchesType = type === 'all' || certificate.type === type;
            const matchesDate = dateFilter === '' || certificate.date === dateFilter;

            return matchesSearch && matchesType && matchesDate;
        });
        set({ typeFilter: type, filteredCertificates: filtered });
    },

    setDateFilter: (date: string) => {
        const { certificates, searchTerm, typeFilter } = get();
        const filtered = certificates.filter((certificate) => {
            const matchesSearch = searchTerm === '' || certificate.number.toString().includes(searchTerm);
            const matchesType = typeFilter === 'all' || certificate.type === typeFilter;
            const matchesDate = date === '' || certificate.date === date;

            return matchesSearch && matchesType && matchesDate;
        });
        set({ dateFilter: date, filteredCertificates: filtered });
    },

    clearFilters: () => {
        const { certificates } = get();
        set({
            searchTerm: '',
            typeFilter: 'all',
            dateFilter: '',
            filteredCertificates: certificates
        });
    },

    getCertificates: async (page = 1, limit = 10) => {
        try {
            set({ loading: true, error: null });
            const response = await CertificateService.getInstance().getCertificates(page, limit);
            const { searchTerm, typeFilter, dateFilter } = get();
            const allCertificates = response.records;

            const filtered = allCertificates.filter((certificate) => {
                const matchesSearch = searchTerm === '' || certificate.number.toString().includes(searchTerm);
                const matchesType = typeFilter === 'all' || certificate.type === typeFilter;
                const matchesDate = dateFilter === '' || certificate.date === dateFilter;

                return matchesSearch && matchesType && matchesDate;
            });

            set({
                certificates: allCertificates,
                filteredCertificates: filtered,
                currentPage: response.page,
                totalPages: response.pages,
                loading: false
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener los certificados";
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
            const message = error instanceof Error ? error.message : "Error al obtener el certificado";
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
            toast.success('Certificado creado exitosamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al crear el certificado";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    updateCertificate: async (certificateId: string, certificate: Partial<ICertificate>) => {
        try {
            set({ loading: true, error: null });
            await CertificateService.getInstance().updateCertificate(certificateId, certificate);
            await get().getCertificates(get().currentPage, 10); // Stay on current page after update
            toast.success('Certificado actualizado exitosamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al actualizar el certificado";
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
            toast.success('Certificado eliminado exitosamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error al eliminar el certificado";
            set({ error: message, loading: false });
            toast.error(message);
        }
    },

    refreshTable: async () => {
        const { currentPage } = get();
        await get().getCertificates(currentPage);
    }
})); 
import { create } from 'zustand';
import { ICertificate } from '../data/interfaces/certificate.interface';
import { CertificateService } from '../services/certificate.service';
import { toast } from 'sonner';

interface CertificateStore {
    certificates: ICertificate[];
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
}

export const useCertificateStore = create<CertificateStore>((set, get) => ({
    certificates: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,

    getCertificates: async (page = 1, limit = 10) => {
        try {
            set({ loading: true, error: null });
            const response = await CertificateService.getInstance().getCertificates(page, limit);
            set({
                certificates: response.records,
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
            await get().refreshTable();
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
            await get().refreshTable();
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
            await get().refreshTable();
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
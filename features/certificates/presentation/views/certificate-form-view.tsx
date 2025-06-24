'use client';

import { useEffect, useState } from 'react';
import { useCertificateStore } from '@/features/certificates/context/certificate-store';
import { useRouter } from 'next/navigation';
import { ICertificate } from '@/features/certificates/data/interfaces/certificate.interface';
import { CertificateForm } from '../components/certificate-form';
import { CertificateFormValues } from '../../data/schemas/certificate.schema';
import { toast } from 'sonner';

interface CertificateFormViewProps {
    id: string;
}

export default function CertificateFormView({ id }: CertificateFormViewProps) {
    const router = useRouter();
    const isEdit = id !== undefined && id !== 'new';

    const {
        getCertificateById,
        addCertificate,
        updateCertificate,
        loading,
    } = useCertificateStore();

    const [initialData, setInitialData] = useState<Partial<ICertificate> | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && id) {
                const certificate = await getCertificateById(id);
                if (certificate) {
                    setInitialData(certificate);
                } else {
                    toast.error('No se encontró el Acta');
                    router.push('/certificates');
                }
            }
        };
        loadData();
    }, [isEdit, id, getCertificateById, router]);

    const handleSubmit = async (data: CertificateFormValues) => {
        try {
            if (isEdit && id) {
                await updateCertificate(id, data);
                toast.success('Acta actualizada exitosamente');
            } else {
                await addCertificate(data);
                toast.success('Acta creada exitosamente');
            }
            router.push('/certificates');
        } catch (error) {
            console.error('Error al guardar el Acta:', error);
            toast.error('Error al guardar el Acta');
        }
    };

    return (
        <div className="space-y-6">
            <CertificateForm
                id={id}
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
} 
'use client';

import { useEffect, useState } from 'react';
import { useCertificateStore } from '@/features/certificates/context/certificate-store';
import { useRouter } from 'next/navigation';
import { ICertificate } from '@/features/certificates/data/interfaces/certificate.interface';
import { CertificateForm } from '../components/certificate-form';
import { CertificateFormValues } from '../../data/schemas/certificate.schema';
import { toast } from 'sonner';

export default function CertificateFormView({ params }: { params: { id?: string } }) {
    const router = useRouter();
    const isEdit = params.id !== undefined && params.id !== 'new';

    const {
        getCertificateById,
        addCertificate,
        updateCertificate,
        loading,
    } = useCertificateStore();

    const [initialData, setInitialData] = useState<Partial<ICertificate> | undefined>(undefined);

    useEffect(() => {
        const loadData = async () => {
            if (isEdit && params.id) {
                const certificate = await getCertificateById(params.id);
                if (certificate) {
                    setInitialData(certificate);
                } else {
                    toast.error('No se encontró el certificado');
                    router.push('/certificates');
                }
            }
        };
        loadData();
    }, [isEdit, params.id, getCertificateById, router]);

    const handleSubmit = async (data: CertificateFormValues) => {
        try {
            if (isEdit && params.id) {
                await updateCertificate(params.id, data);
                toast.success('Certificado actualizado exitosamente');
            } else {
                await addCertificate(data);
                toast.success('Certificado creado exitosamente');
            }
            router.push('/certificates');
        } catch (error) {
            console.error('Error al guardar el certificado:', error);
            toast.error('Error al guardar el certificado');
        }
    };

    return (
        <div className="space-y-6">
            <CertificateForm
                id={params.id}
                initialData={initialData}
                onSubmit={handleSubmit}
                isLoading={loading}
            />
        </div>
    );
} 
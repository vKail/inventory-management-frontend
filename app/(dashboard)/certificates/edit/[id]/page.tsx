import CertificateFormView from '@/features/certificates/presentation/views/certificate-form-view';

export default function CertificateFormPage({ params }: { params: { id: string } }) {
    return <CertificateFormView params={params} />;
} 
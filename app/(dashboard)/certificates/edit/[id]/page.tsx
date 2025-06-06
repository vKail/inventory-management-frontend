'use client'

import CertificateFormView from '@/features/certificates/presentation/views/certificate-form-view';
import { useParams } from 'next/navigation';

export default function CertificateFormPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CertificateFormView id={id} />
    </div>
  );
}
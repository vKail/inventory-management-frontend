import { z } from 'zod';
import { CertificateType, CertificateStatus } from '../schemas/certificate.schema';

export type ICertificateType = z.infer<typeof CertificateType>;
export type ICertificateStatus = z.infer<typeof CertificateStatus>;

export interface ICertificate {
    id: string;
    number: number;
    date: string;
    type: ICertificateType;
    status: ICertificateStatus;
    deliveryResponsibleId: number;
    receptionResponsibleId: number;
    observations: string;
    accounted: boolean;
}

export interface PaginatedCertificates {
    total: number;
    limit: number;
    page: number;
    pages: number;
    records: ICertificate[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: {
        content: string[];
    };
    data: T;
}

export interface PaginatedResponse<T> {
    records: T[];
    total: number;
    limit: number;
    page: number;
    pages: number;
}

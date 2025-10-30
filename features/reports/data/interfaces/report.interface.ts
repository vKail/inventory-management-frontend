export type ReportRow = {
    id?: string | number;
    code: string;
    name: string;
    location: string;
    locationId?: number | null;
    scannedAt?: string;
    raw?: any;
};

export type ReportType = 'area';

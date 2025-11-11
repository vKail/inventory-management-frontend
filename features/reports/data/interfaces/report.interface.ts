export type ReportRow = {
    id?: string | number;
    code: string;
    name: string;
    location: string;
    locationId?: number | null;
    scannedAt?: string;
    raw?: any;
    // For custodian-handover reports
    currentCustodian?: string;
    currentCustodianId?: number | null;
    newCustodian?: string;
    newCustodianId?: number | null;
    // For reconciliation reports
    isUnknown?: boolean; // Item not found in database
    status?: 'verified' | 'missing' | 'unknown'; // Item status in reconciliation
    condition?: string; // Condition name for reconciliation
    stock?: number; // Stock quantity for reconciliation
};

export type ReportType = 'area' | 'custodian-handover' | 'reconciliation';

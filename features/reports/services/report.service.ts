import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { ReportRow } from '@/features/reports/data/interfaces/report.interface';

interface ReportServiceProps {
    getItemByCode: (code: string) => Promise<any | null>;
    updateItemLocation: (itemId: string | number, locationId: number) => Promise<any>;
    updateItemCustodian: (itemId: string | number, custodianId: number) => Promise<any>;
}

export class ReportService implements ReportServiceProps {
    private static instance: ReportService;
    private httpClient: HttpHandler;
    private static readonly url = 'items';

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ReportService {
        if (!ReportService.instance) {
            ReportService.instance = new ReportService();
        }
        return ReportService.instance;
    }

    public async getItemByCode(code: string): Promise<any | null> {
        try {
            const url = `${ReportService.url}?code=${encodeURIComponent(code)}`;
            const response = await this.httpClient.get<any>(url, {} as any);
            if (!response || !response.success) return null;
            return response.data.records && response.data.records.length > 0 ? response.data.records[0] : null;
        } catch (error) {
            console.error('ReportService.getItemByCode error', error);
            return null;
        }
    }

    public async updateItemLocation(itemId: string | number, locationId: number): Promise<any> {
        try {
            const url = `${ReportService.url}/${itemId}`;
            const body = { locationId };
            const response = await this.httpClient.patch<any>(url, body, {} as any);
            return response;
        } catch (error) {
            console.error('ReportService.updateItemLocation error', error);
            throw error;
        }
    }

    public async updateItemCustodian(itemId: string | number, custodianId: number): Promise<any> {
        try {
            const url = `${ReportService.url}/${itemId}`;
            const body = { custodianId };
            const response = await this.httpClient.patch<any>(url, body, {} as any);
            return response;
        } catch (error) {
            console.error('ReportService.updateItemCustodian error', error);
            throw error;
        }
    }
}

export const reportService = ReportService.getInstance();

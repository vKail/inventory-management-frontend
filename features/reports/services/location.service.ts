import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface LocationRecord {
    id: number;
    name: string;
}

export class ReportLocationService {
    private static instance: ReportLocationService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}locations`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ReportLocationService {
        if (!ReportLocationService.instance) {
            ReportLocationService.instance = new ReportLocationService();
        }
        return ReportLocationService.instance;
    }

    public async getLocations(query?: string): Promise<LocationRecord[]> {
        try {
            let url = `${ReportLocationService.url}?allRecords=TRUE`;
            if (query) url += `&name=${encodeURIComponent(query)}`;
            const resp: any = await this.httpClient.get<any>(url, {} as any);
            if (!resp || !resp.success) return [];
            return resp.data && Array.isArray(resp.data.records) ? resp.data.records : [];
        } catch (error) {
            console.error('ReportLocationService.getLocations error', error);
            return [];
        }
    }
}

export const reportLocationService = ReportLocationService.getInstance();

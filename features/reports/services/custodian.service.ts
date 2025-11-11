import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

export class ReportCustodianService {
    private static instance: ReportCustodianService;
    private httpClient: HttpHandler;
    private static readonly url = 'users';

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ReportCustodianService {
        if (!ReportCustodianService.instance) {
            ReportCustodianService.instance = new ReportCustodianService();
        }
        return ReportCustodianService.instance;
    }

    async getCustodians(): Promise<Array<{ id: number; name: string; dni: string }>> {
        try {
            // Get all users to use as custodians
            const response = await this.httpClient.get<any>(
                `${ReportCustodianService.url}?allRecords=true`
            );
            if (!response.success) {
                return [];
            }
            // Map users to simple custodian objects
            return (response.data.records || []).map((user: any) => ({
                id: user.id,
                name: user.person
                    ? `${user.person.firstName ?? ''} ${user.person.lastName ?? ''}`.trim()
                    : user.userName,
                dni: user.person?.dni ?? '',
            }));
        } catch (error) {
            console.error('Error fetching custodians:', error);
            return [];
        }
    }
}

export const reportCustodianService = ReportCustodianService.getInstance();

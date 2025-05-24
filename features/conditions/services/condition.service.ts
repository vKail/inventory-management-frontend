import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { ApiResponse, ICondition, PaginatedConditions } from '../data/interfaces/condition.interface';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';

interface ConditionServiceProps {
    getConditions: (page?: number, limit?: number) => Promise<PaginatedConditions>;
    getConditionById: (id: string) => Promise<ICondition | undefined>;
    createCondition: (condition: Partial<ICondition>) => Promise<ICondition | undefined>;
    updateCondition: (id: string, condition: Partial<ICondition>) => Promise<ICondition | undefined>;
    deleteCondition: (id: string) => Promise<void>;
}

export class ConditionService implements ConditionServiceProps {
    private static instance: ConditionService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}conditions`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): ConditionService {
        if (!ConditionService.instance) {
            ConditionService.instance = new ConditionService();
        }
        return ConditionService.instance;
    }

    public async getConditions(page = 1, limit = 10): Promise<PaginatedConditions> {
        try {
            const response = await this.httpClient.get<ApiResponse<PaginatedConditions>>(
                `${ConditionService.url}?page=${page}&limit=${limit}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching conditions:', error);
            throw error;
        }
    }

    public async getConditionById(id: string): Promise<ICondition | undefined> {
        try {
            const response = await this.httpClient.get<ApiResponse<ICondition>>(`${ConditionService.url}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching condition:', error);
            return undefined;
        }
    }

    public async createCondition(condition: Partial<ICondition>): Promise<ICondition | undefined> {
        try {
            const response = await this.httpClient.post<ApiResponse<ICondition>>(
                ConditionService.url,
                condition
            );
            return response.data;
        } catch (error) {
            console.error('Error creating condition:', error);
            throw error;
        }
    }

    public async updateCondition(id: string, condition: Partial<ICondition>): Promise<ICondition | undefined> {
        try {
            const response = await this.httpClient.patch<ApiResponse<ICondition>>(
                `${ConditionService.url}/${id}`,
                condition
            );
            return response.data;
        } catch (error) {
            console.error('Error updating condition:', error);
            throw error;
        }
    }

    public async deleteCondition(id: string): Promise<void> {
        try {
            const response = await this.httpClient.delete<ApiResponse<void>>(`${ConditionService.url}/${id}`);
            if (!response.data.success) {
                throw new Error(response.data.message.content.join(', '));
            }
        } catch (error) {
            console.error('Error deleting condition:', error);
            throw error;
        }
    }
} 
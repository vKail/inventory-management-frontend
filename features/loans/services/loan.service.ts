import { HttpHandler, IHttpResponse } from '@/core/data/interfaces/HttpHandler';
import { AxiosClient } from '@/core/infrestucture/AxiosClient';
import { Loan, LoanCreate, LoanReturn, ApiResponse, PaginatedResponse } from "../data/interfaces/loan.interface";

interface LoanServiceProps {
    getAll: (queryString: string) => Promise<ApiResponse<PaginatedResponse<Loan>>>;
    getById: (id: number) => Promise<Loan | undefined>;
    getHistoryByDni: (dni: string) => Promise<Loan[]>;
    create: (loan: LoanCreate) => Promise<IHttpResponse<Loan>>;
    return: (loanReturn: LoanReturn) => Promise<IHttpResponse<Loan>>;
}

export class LoanService implements LoanServiceProps {
    private static instance: LoanService;
    private httpClient: HttpHandler;
    private static readonly url = `${process.env.NEXT_PUBLIC_API_URL}loans`;

    private constructor() {
        this.httpClient = AxiosClient.getInstance();
    }

    public static getInstance(): LoanService {
        if (!LoanService.instance) {
            LoanService.instance = new LoanService();
        }
        return LoanService.instance;
    }

    public async getAll(queryString: string): Promise<ApiResponse<PaginatedResponse<Loan>>> {
        try {
            const url = `${LoanService.url}?${queryString}`;
            const response = await this.httpClient.get<PaginatedResponse<Loan>>(url);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return {
                success: response.success,
                message: {
                    content: response.message.content,
                    displayable: true
                },
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching loans:', error);
            throw error;
        }
    }

    public async getById(id: number): Promise<Loan | undefined> {
        try {
            const response = await this.httpClient.get<Loan>(`${LoanService.url}/${id}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching loan:', error);
            return undefined;
        }
    }

    public async getHistoryByDni(dni: string): Promise<Loan[]> {
        try {
            const response = await this.httpClient.get<Loan[]>(`${LoanService.url}/historial/${dni}`);
            if (!response.success) {
                throw new Error(response.message.content.join(', '));
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching loan history:', error);
            return [];
        }
    }

    public async create(loan: LoanCreate): Promise<IHttpResponse<Loan>> {
        try {
            const response = await this.httpClient.post<Loan>(
                LoanService.url,
                loan
            );
            return response;
        } catch (error) {
            console.error('Error creating loan:', error);
            throw error;
        }
    }

    public async return(loanReturn: LoanReturn): Promise<IHttpResponse<Loan>> {
        try {
            const response = await this.httpClient.post<Loan>(
                `${LoanService.url}/return`,
                loanReturn
            );
            return response;
        } catch (error) {
            console.error('Error returning loan:', error);
            throw error;
        }
    }
}

// Exportar la instancia para usar directamente
export const loanService = LoanService.getInstance(); 
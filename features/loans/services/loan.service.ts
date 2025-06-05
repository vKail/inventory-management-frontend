import { HttpHandler } from "@/core/data/interfaces/HttpHandler";
import { LoanListResponse, LoanResponse } from "../data/schemas/loan.schema";

export class LoanService {
    constructor(private readonly httpClient: HttpHandler) { }

    async getLoans(page: number = 1, limit: number = 10): Promise<LoanListResponse> {
        const response = await this.httpClient.get<LoanListResponse>(`/loans?page=${page}&limit=${limit}`);
        return response.data;
    }

    async getLoanById(id: number): Promise<LoanResponse> {
        const response = await this.httpClient.get<LoanResponse>(`/loans/${id}`);
        return response.data;
    }
}

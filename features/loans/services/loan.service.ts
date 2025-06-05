import { AxiosClient } from "@/core/infrestucture/AxiosClient";
import { LoanListResponse, LoanResponse } from "../data/schemas/loan.schema";

export class LoanService {
    constructor(private readonly client: AxiosClient) { }

    async getLoans(page: number = 1, limit: number = 10): Promise<LoanListResponse> {
        const response = await this.client.get<LoanListResponse>(`/loans?page=${page}&limit=${limit}`);
        return response;
    }

    async getLoanById(id: number): Promise<LoanResponse> {
        const response = await this.client.get<LoanResponse>(`/loans/${id}`);
        return response;
    }
}

import { HttpHandler } from '@/core/data/interfaces/HttpHandler';
import { LoanListResponse, LoanResponse } from '../data/dtos/loan-res.dto';

export class LoanService {
  constructor(private readonly httpClient: HttpHandler) {}

  async getLoans(page: number = 1, limit: number = 10): Promise<LoanListResponse> {
    const response = await this.httpClient.get<LoanListResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}loans?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getLoanById(id: number): Promise<LoanResponse> {
    const response = await this.httpClient.get<LoanResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}loans/${id}`
    );
    return response.data;
  }

  async createLoan(data: any): Promise<LoanResponse> {
    const response = await this.httpClient.post<LoanResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}loans`,
      data
    );
    return response.data;
  }

  async processReturn(data: any): Promise<LoanResponse> {
    const response = await this.httpClient.post<LoanResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}loans/return`,
      data
    );
    return response.data;
  }
}
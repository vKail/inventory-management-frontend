import { Loan } from '../schemas/loan.schema';

// DTO for a single loan response
export interface LoanResponse {
  data: Loan;
}

// DTO for a paginated list of loans
export interface LoanListResponse {
  data: {
    records: Loan[];
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
}
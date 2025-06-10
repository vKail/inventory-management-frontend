// features/loans/data/schemas/loan.schema.ts
export enum LoanStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    DELIVERED = 'DELIVERED',
    RETURNED = 'RETURNED',
    RETURNED_LATE = 'RETURNED_LATE',
    CANCELLED = 'CANCELLED',
  }
  
  export interface LoanDetail {
    id: number;
    loanId: number;
    itemId: number;
    exitConditionId: number;
    returnConditionId: number | null;
    exitObservations: string;
    returnObservations: string | null;
    item?: {
      name?: string;
      code?: string;
    };
  }
  
  export interface Loan {
    id: number;
    loanCode: string;
    requestDate: Date;
    approvalDate: Date | null;
    deliveryDate: Date | null;
    scheduledReturnDate: Date;
    actualReturnDate: Date | null;
    status: LoanStatus;
    requestorId: number;
    approverId: number | null;
    reason: string;
    associatedEvent: string | null;
    externalLocation: string | null;
    notes: string | null;
    responsibilityDocument: string | null;
    reminderSent: boolean;
    loanDetails: LoanDetail[];
  }
  
  export interface LoanListResponse {
    records: Loan[];
    page: number;
    pages: number;
    total: number;
    limit: number;
  }
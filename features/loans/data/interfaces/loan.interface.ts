import { LoanDetailResDto } from '../schemas/loan-detail.schema';
import { LoanStatus } from '../schemas/loan.schema';

export interface Loan {
  id: number;
  loanCode: string;
  requestDate: Date;
  approvalDate: Date;
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
  loanDetails: LoanDetailResDto[];
}
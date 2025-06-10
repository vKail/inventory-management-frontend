import { CreateLoanDetailDto } from './create-loan-detail.dto';

export interface CreateLoanDto {
  scheduledReturnDate: Date;
  requestorId: string;
  reason: string;
  associatedEvent?: string;
  externalLocation?: string;
  notes?: string;
  loanDetails: CreateLoanDetailDto[];
  blockBlackListed?: boolean;
}


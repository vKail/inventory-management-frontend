import { Exclude, Expose } from 'class-transformer';

/**
 * Interface representing the response DTO for a loan detail, aligning with the backend's LoanDetailResDto.
 */
export interface LoanDetailResDto {
  @Expose()
  id: number;

  @Expose()
  loanId: number;

  @Expose()
  itemId: number;

  @Expose()
  exitConditionId: number;

  @Expose()
  returnConditionId: number | null;

  @Expose()
  exitObservations: string;

  @Expose()
  returnObservations: string;

  @Exclude()
  registrationDate: Date;

  @Exclude()
  updateDate: Date;
}
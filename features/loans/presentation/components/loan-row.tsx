'use client';

import { Loan } from '@/features/loans/data/interfaces/loan.interface';
import { Button } from '@/components/ui/button';

interface LoanRowProps {
  loan: Loan;
  onReturnClick: (loan: Loan) => void;
}

export default function LoanRow({ loan, onReturnClick }: LoanRowProps) {
  return (
    <div className="flex items-center justify-between border rounded-md p-4">
      <div>
        <h3 className="text-lg font-medium">{loan.product?.name}</h3>
        <p className="text-sm text-muted-foreground">Código: {loan.product?.barcode}</p>
        <p className="text-sm">Usuario: {loan.user?.name}</p>
      </div>
      <div className="text-right space-y-1">
        <p className="text-sm">Inicio: {loan.startDate.toLocaleDateString()}</p>
        <p className="text-sm">Vencimiento: {loan.dueDate.toLocaleDateString()}</p>
        <Button size="sm" onClick={() => onReturnClick(loan)}>
          Devolver
        </Button>
      </div>
    </div>
  );
}

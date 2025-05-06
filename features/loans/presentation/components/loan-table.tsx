'use client';

import { Loan } from '@/features/loans/data/interfaces/loan.interface';
import { LoanStatus } from '@/features/loans/data/enums/loan-status.enum';
import { LoanStatusBadge } from './loan-status-badge';
import { Button } from '@/components/ui/button';

interface LoanTableProps {
  loans: Loan[];
  onReturnClick: (loan: Loan) => void;
}

export default function LoanTable({ loans, onReturnClick }: LoanTableProps) {
  return (
    <div className="overflow-x-auto border rounded-md shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 font-semibold">Producto</th>
            <th className="p-3 font-semibold">Código</th>
            <th className="p-3 font-semibold">Usuario</th>
            <th className="p-3 font-semibold">Fecha Inicio</th>
            <th className="p-3 font-semibold">Fecha Vencimiento</th>
            <th className="p-3 font-semibold">Estado</th>
            <th className="p-3 font-semibold text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.id} className="border-t">
              <td className="p-3">{loan.product?.name}</td>
              <td className="p-3">{loan.product?.barcode}</td>
              <td className="p-3">{loan.user?.name}</td>
              <td className="p-3">{loan.startDate.toLocaleDateString()}</td>
              <td className="p-3">{loan.dueDate.toLocaleDateString()}</td>
              <td className="p-3">
                <LoanStatusBadge status={loan.status as LoanStatus} />
              </td>
              <td className="p-3 text-right">
                {loan.status === LoanStatus.ACTIVE && (
                  <Button size="sm" onClick={() => onReturnClick(loan)}>
                    Devolver
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

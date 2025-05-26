'use client';

import { useState } from 'react';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';
import { LoanStatus } from '@/features/loans/data/enums/loan-status.enum';
import { LoanStatusBadge } from './loan-status-badge';
import { Button } from '@/components/ui/button';
import { LoanDetailModal } from './loan-detail-modal';

interface LoanTableProps {
  loans: Loan[];
  onReturnClick: (loan: Loan) => void;
}

export default function LoanTable({ loans, onReturnClick }: LoanTableProps) {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const openModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowDetail(true);
  };

  return (
    <>
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
              <tr key={loan.id} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <button
                    onClick={() => openModal(loan)}
                    className="text-blue-600 hover:underline font-medium"
                    title="Ver detalles del préstamo"
                  >
                    {loan.product?.name}
                  </button>
                </td>
                <td className="p-3">{loan.product?.barcode}</td>
                <td className="p-3">{loan.user?.name}</td>
                <td className="p-3">{new Date(loan.startDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(loan.dueDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <LoanStatusBadge status={loan.status as LoanStatus} />
                </td>
                <td className="p-3 text-right">
                  {loan.status === LoanStatus.ACTIVE && (
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => onReturnClick(loan)}
                    >
                      Devolver
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <LoanDetailModal
        open={showDetail}
        loan={selectedLoan ?? undefined}
        onClose={() => setShowDetail(false)}
      />
    </>
  );
}

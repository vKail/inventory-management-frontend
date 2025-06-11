'use client';

import { Badge } from '@/components/ui/badge';
import { LoanStatus } from '@/features/loans/data/enums/loan-status.enum';

interface LoanStatusBadgeProps {
  status: LoanStatus;
}


export function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  switch (status) {
    case LoanStatus.ACTIVE:
      return <Badge className="bg-green-100 text-green-800">Activo</Badge>;

    case LoanStatus.RETURNED:
      return <Badge className="bg-blue-100 text-blue-800">Devuelto</Badge>;

    case LoanStatus.OVERDUE:
      return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;

    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
  }
}

'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';
import { format } from 'date-fns';

interface LoanDetailModalProps {
  open: boolean;
  loan?: Loan;
  onClose: () => void;
}

// Función para traducir estado a español
function getEstadoEnEspanol(status: string): string {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'returned':
      return 'Devuelto';
    case 'overdue':
      return 'Vencido';
    default:
      return 'Desconocido';
  }
}

export function LoanDetailModal({ open, loan, onClose }: LoanDetailModalProps) {
  if (!loan) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalle del préstamo</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>Producto:</strong> {loan.product?.name}</p>
          <p><strong>Código:</strong> {loan.product?.barcode}</p>
          <p><strong>Usuario:</strong> {loan.user?.name}</p>
          {loan.user?.studentId && (
            <p><strong>Carné:</strong> {loan.user.studentId}</p>
          )}
          <p><strong>Correo:</strong> {loan.user?.email}</p>
          <p><strong>Inicio:</strong> {format(new Date(loan.startDate), 'dd/MM/yyyy')}</p>
          <p><strong>Vencimiento:</strong> {format(new Date(loan.dueDate), 'dd/MM/yyyy')}</p>
          {loan.returnDate && (
            <p><strong>Devuelto el:</strong> {format(new Date(loan.returnDate), 'dd/MM/yyyy')}</p>
          )}
          {loan.notes && (
            <p><strong>Notas:</strong> {loan.notes}</p>
          )}
          <p><strong>Estado:</strong> {getEstadoEnEspanol(loan.status)}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

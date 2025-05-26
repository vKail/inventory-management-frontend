'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';

interface ReturnModalProps {
  open: boolean;
  loan?: Loan;
  onClose: () => void;
  onConfirm: (loan: Loan) => void;
}

export function ReturnModal({ open, loan, onClose, onConfirm }: ReturnModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Registrar devolución?</DialogTitle>
        </DialogHeader>

        <p>
          Estás a punto de registrar la devolución del producto{' '}
          <strong>{loan?.product?.name}</strong> prestado a{' '}
          <strong>{loan?.user?.name}</strong>.
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => loan && onConfirm(loan)} className="bg-green-600 hover:bg-green-700">
            Confirmar devolución
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

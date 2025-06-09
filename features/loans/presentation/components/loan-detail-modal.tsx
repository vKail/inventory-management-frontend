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
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';

interface LoanDetailModalProps {
  open: boolean;
  loan?: Loan;
  onClose: () => void;
}
/**
 * Convierte el estado del préstamo a su equivalente en español
 * @param {string} status - Estado del préstamo en inglés
 * @returns {string} Estado del préstamo en español
 * @example
 * getEstadoEnEspanol('active') // retorna 'Activo'
 * getEstadoEnEspanol('returned') // retorna 'Devuelto'
 * getEstadoEnEspanol('overdue') // retorna 'Vencido'
 */
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
/**
 * Genera un texto detallado con la información del préstamo
 * @param {Loan} loan - Objeto con la información del préstamo
 * @returns {string} Texto formateado con los detalles del préstamo
 */
function generarTextoDetalle(loan: Loan): string {
  const detalles: string[] = [];
  detalles.push(`Producto: ${loan.product?.name ?? '-'}`);
  detalles.push(`Código: ${loan.product?.barcode ?? '-'}`);
  detalles.push(`Usuario: ${loan.user?.name ?? '-'}`);
  if (loan.user?.studentId) detalles.push(`Carné: ${loan.user.studentId}`);
  detalles.push(`Correo: ${loan.user?.email ?? '-'}`);
  detalles.push(`Inicio: ${format(new Date(loan.startDate), 'dd/MM/yyyy')}`);
  detalles.push(`Vencimiento: ${format(new Date(loan.dueDate), 'dd/MM/yyyy')}`);
  if (loan.returnDate)
    detalles.push(`Devuelto el: ${format(new Date(loan.returnDate), 'dd/MM/yyyy')}`);
  if (loan.notes) detalles.push(`Notas: ${loan.notes}`);
  detalles.push(`Estado: ${getEstadoEnEspanol(loan.status)}`);
  return detalles.join('\n');
}
export function LoanDetailModal({ open, loan, onClose }: LoanDetailModalProps) {
  if (!loan) return null;
  const handleCopy = () => {
    const texto = generarTextoDetalle(loan);
    navigator.clipboard.writeText(texto).then(() => {
      toast.success('Detalle copiado al portapapeles');
    }).catch(() => {
      toast.error('Error al copiar al portapapeles');
    });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Detalle del préstamo</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              title="Copiar al portapapeles"
            >
              <ClipboardCopy className="w-5 h-5" />
            </Button>
          </div>
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

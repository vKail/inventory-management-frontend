'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Package, Handshake, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useLoanStore } from '../../context/loan-store';
import LoaderComponent from '@/shared/components/ui/Loader';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loan, LoanStatus } from '../../data/schemas/loan.schema';

interface LoanTableProps {
  onReturnClick: (loan: Loan) => void;
}

/**
 * Devuelve un Badge con el estado del préstamo según su estado.
 * @param status Estado del préstamo
 * @returns ReactNode con el Badge
 */
const getLoanStatusBadge = (status: LoanStatus) => {
  const variants: { [key in LoanStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    PENDING: 'secondary',
    APPROVED: 'default',
    REJECTED: 'destructive',
    DELIVERED: 'default',
    RETURNED: 'outline',
    RETURNED_LATE: 'destructive',
    CANCELLED: 'destructive',
  };
  const labels: { [key in LoanStatus]: string } = {
    PENDING: 'Pendiente',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    DELIVERED: 'Entregado',
    RETURNED: 'Devuelto',
    RETURNED_LATE: 'Devuelto con retraso',
    CANCELLED: 'Cancelado',
  };
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

/**
 * Formatea una fecha ISO o devuelve '-' si no es válida.
 * @param dateString Fecha en formato ISO o null
 * @returns String con la fecha formateada o '-'
 */
const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  try {
    return format(parseISO(dateString), 'PPP', { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

export default function LoanTable({ onReturnClick }: LoanTableProps) {
  const router = useRouter();
  const { loans, isLoading, getLoans } = useLoanStore();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        await getLoans(1, itemsPerPage);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error al cargar los datos');
      }
    };
    loadData();
  }, [getLoans]);

  const handleCopyLoan = (loan: Loan) => {
    router.push(`/loans/request?copy=${loan.id}`);
    setSelectedLoan(null);
  };

  if (isLoading.fetch) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Préstamos</CardTitle>
            <Button onClick={() => router.push('/loans/request')}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Préstamo
            </Button>
          </CardHeader>
          <CardContent>
            <LoaderComponent rows={5} columns={6} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Préstamos</CardTitle>
          <Button onClick={() => router.push('/loans/request')}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Préstamo
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Fecha Entrega</TableHead>
                <TableHead>Fecha Devolución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-10 w-10 text-gray-400" />
                      <p className="text-sm text-gray-600">No hay préstamos registrados</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>{loan.id}</TableCell>
                    <TableCell>{formatDate(loan.deliveryDate)}</TableCell>
                    <TableCell>{formatDate(loan.scheduledReturnDate)}</TableCell>
                    <TableCell>{getLoanStatusBadge(loan.status)}</TableCell>
                    <TableCell>{loan.reason}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {loan.status === LoanStatus.DELIVERED && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onReturnClick(loan)}
                        >
                          <Handshake className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={selectedLoan !== null} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalles del Préstamo</DialogTitle>
            <DialogDescription>Información detallada del préstamo seleccionado</DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Información General</h4>
                <p><span className="font-medium">ID:</span> {selectedLoan.id}</p>
                <p><span className="font-medium">Estado:</span> {getLoanStatusBadge(selectedLoan.status)}</p>
                <p><span className="font-medium">Fecha de Entrega:</span> {formatDate(selectedLoan.deliveryDate)}</p>
                <p><span className="font-medium">Fecha de Devolución:</span> {formatDate(selectedLoan.scheduledReturnDate)}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Detalles</h4>
                <p><span className="font-medium">Motivo:</span> {selectedLoan.reason}</p>
                {selectedLoan.associatedEvent && (
                  <p><span className="font-medium">Evento Asociado:</span> {selectedLoan.associatedEvent}</p>
                )}
                <p><span className="font-medium">Ubicación Externa:</span> {selectedLoan.externalLocation}</p>
                {selectedLoan.notes && <p><span className="font-medium">Notas:</span> {selectedLoan.notes}</p>}
              </div>
              <div className="col-span-2">
                <h4 className="font-semibold mb-2">Items Prestados</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedLoan.loanDetails.map((detail) => (
                    <li key={detail.id}>
                      {detail.item?.name || 'Item sin nombre'} - {detail.item?.code || 'Sin código'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setSelectedLoan(null)}>Cerrar</Button>
            <Button onClick={() => selectedLoan && handleCopyLoan(selectedLoan)} className="flex items-center gap-2">
              <Copy className="h-4 w-4" /> Copiar Préstamo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
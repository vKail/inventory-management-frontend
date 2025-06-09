'use client';

import { useRouter } from 'next/navigation';
import { useLoanStore } from '../../context/loan-store';
import LoanCard from '../components/loan-card';
import LoanRow from '../components/loan-row';
import LoanTable from '../components/loan-table';
import { ReturnModal } from '../components/return-modal';
import LoanFilters from '../components/loan-filters';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useState } from 'react';
import { Loan, LoanStatus } from '@/features/loans/data/schemas/loan.schema';
import { Button } from '@/components/ui/button';
import { Table, List, LayoutGrid, Plus, Handshake } from 'lucide-react';
import { toast } from 'sonner';

export default function LoansView() {
  const router = useRouter();

  const { loans, markAsReturned } = useLoanStore();
  const [filtered, setFiltered] = useState<Loan[]>(loans);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'grid'>('table');

  const handleReturnClick = (loan: Loan) => {
    if (loan.status === LoanStatus.DELIVERED) {
      setSelectedLoan(loan);
      setShowModal(true);
    }
  };

  const handleConfirmReturn = async (loan: Loan) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}loans/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanId: loan.id,
          actualReturnDate: new Date().toISOString(),
          returnedItems: loan.loanDetails.map((detail) => ({
            loanDetailId: detail.id,
            returnConditionId: 1,
            returnObservations: 'Returned in good condition',
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process return');
      }

      markAsReturned(loan.id);
      setShowModal(false);
      toast.success('Préstamo devuelto con éxito');
    } catch (error) {
      console.error('Error processing return:', error);
      toast.error('Error al procesar la devolución');
    }
  };

  const handleRegisterLoan = () => {
    router.push('/loans/request');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Operaciones</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Handshake className="w-4 h-4 text-red-600 mr-1" />
            <BreadcrumbPage>Préstamos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de préstamos</h1>
        <div className="flex items-center gap-2">
          <Button className="bg-primary text-white" onClick={handleRegisterLoan}>
            <Plus className="w-4 h-4 mr-2" />
            Registrar préstamo
          </Button>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('table')}
            >
              <Table className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <LoanFilters loans={loans} onFilter={setFiltered} />

      {viewMode === 'table' && <LoanTable onReturnClick={handleReturnClick} />}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filtered.map((loan) => (
            <LoanRow key={loan.id} loan={loan} onReturnClick={handleReturnClick} />
          ))}
        </div>
      )}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((loan) => (
            <LoanCard key={loan.id} loan={loan} onReturnClick={handleReturnClick} />
          ))}
        </div>
      )}

      <ReturnModal
        open={showModal}
        loan={selectedLoan}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReturn}
      />
    </div>
  );
}
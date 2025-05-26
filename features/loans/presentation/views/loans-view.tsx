'use client';

import { useRouter } from 'next/navigation';
import { useLoanStore } from '@/features/loans/context/loans-store';
import LoanCard from '@/features/loans/presentation/components/loan-card';
import LoanRow from '@/features/loans/presentation/components/loan-row';
import LoanTable from '@/features/loans/presentation/components/loan-table';
import { ReturnModal } from '@/features/loans/presentation/components/return-modal';
import LoanFilters from '@/features/loans/presentation/components/loan-filters';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useState } from 'react';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';
import { Button } from '@/components/ui/button';
import { Table, List, LayoutGrid, Plus, Handshake } from 'lucide-react';

export default function LoansView() {
  const router = useRouter();

  const { loans, markAsReturned } = useLoanStore();
  const [filtered, setFiltered] = useState<Loan[]>(loans);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'list' | 'grid'>('table');

  const handleReturnClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleConfirmReturn = (loan: Loan) => {
    markAsReturned(loan.id);
    setShowModal(false);
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

      {viewMode === 'table' && (
        <LoanTable loans={filtered} onReturnClick={handleReturnClick} />
      )}

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
        loan={selectedLoan ?? undefined}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReturn}
      />
    </div>
  );
}

'use client';

import { useLoanStore } from '@/features/loans/context/loans-store';
import LoanCard from '@/features/loans/presentation/components/LoanCard';
import LoanRow from '@/features/loans/presentation/components/loan-row';
import LoanTable from '@/features/loans/presentation/components/loan-table';
import { ReturnModal } from '@/features/loans/presentation/components/return-modal';
import LoanFilters from '@/features/loans/presentation/components/loan-filters';
import { useState } from 'react';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Table } from 'lucide-react';

export default function LoansView() {
  const { loans, markAsReturned } = useLoanStore();
  const [filtered, setFiltered] = useState<Loan[]>(loans);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  const handleReturnClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleConfirmReturn = (loan: Loan) => {
    markAsReturned(loan.id);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de préstamos</h1>

        <div className="flex gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-5 h-5" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <Table className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <LoanFilters loans={loans} onFilter={setFiltered} />

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              onReturnClick={handleReturnClick}
            />
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          {filtered.map((loan) => (
            <LoanRow
              key={loan.id}
              loan={loan}
              onReturnClick={handleReturnClick}
            />
          ))}
        </div>
      )}

      {viewMode === 'table' && (
        <LoanTable loans={filtered} onReturnClick={handleReturnClick} />
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

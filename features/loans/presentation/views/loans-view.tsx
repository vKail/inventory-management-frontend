'use client';

import { useLoanStore } from '@/features/loans/context/loans-store';
import LoanCard from '@/features/loans/presentation/components/LoanCard';
import { ReturnModal } from '@/features/loans/presentation/components/return-modal';
import LoanFilters from '@/features/loans/presentation/components/loan-filters';
import { useState } from 'react';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';

export default function LoansView() {
  const { loans, setActiveTab, activeTab } = useLoanStore();
  const [filtered, setFiltered] = useState<Loan[]>(loans);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleReturnClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleConfirmReturn = (loan: Loan) => {
    loan.status = 'returned';
    loan.returnDate = new Date();
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de préstamos</h1>

      <LoanFilters loans={loans} onFilter={setFiltered} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((loan) => (
          <LoanCard key={loan.id} loan={loan} onReturnClick={handleReturnClick} />
        ))}
      </div>

      <ReturnModal
        open={showModal}
        loan={selectedLoan ?? undefined}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmReturn}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import LoanCard from '@/features/loans/presentation/components/LoanCard';
import LoanFilters from '@/features/loans/presentation/components/loan-filters';
import { useLoanStore } from '@/features/loans/context/loans-store';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';

export default function LoansView() {
  const { loans } = useLoanStore(); 
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>(loans);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de préstamos</h1>

      <LoanFilters loans={loans} onFilter={setFilteredLoans} />

      {filteredLoans.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No se encontraron préstamos que coincidan con los filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
}

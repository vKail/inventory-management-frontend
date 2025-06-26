'use client';

import { Suspense } from 'react';
import { LoanView } from "@/features/loans/presentation/views/loan-view";

export default function LoansPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Suspense fallback={<div>Cargando...</div>}>
        <LoanView />
      </Suspense>
    </div>
  );
}
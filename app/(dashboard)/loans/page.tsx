'use client';

import { Suspense } from 'react';
import { LoanView } from "@/features/loans/presentation/views/loan-view";

export default function LoansPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoanView />
    </Suspense>
  );
}
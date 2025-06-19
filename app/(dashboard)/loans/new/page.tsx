'use client';

import { Suspense } from "react";
import { LoanFormView } from "@/features/loans/presentation/views/loan-form-view";

export default function NewLoanPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <LoanFormView />
        </Suspense>
    );
}

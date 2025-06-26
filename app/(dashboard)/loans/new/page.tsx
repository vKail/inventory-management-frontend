'use client';

import { Suspense } from "react";
import { LoanFormView } from "@/features/loans/presentation/views/loan-form-view";

export default function NewLoanPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <Suspense fallback={<div>Cargando...</div>}>
                <LoanFormView />
            </Suspense>
        </div>
    );
}

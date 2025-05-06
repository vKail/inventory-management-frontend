'use client';

import { Card } from "@/components/ui/card";
import NewLoanForm  from "../components/new-loan-form";

export default function LoanRequestView() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6"></h1>
      <Card>
        <NewLoanForm />
      </Card>
    </div>
  );
}

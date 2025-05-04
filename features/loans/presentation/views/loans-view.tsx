// features/loans/presentation/views/loans-view.tsx
'use client';

import { useLoanStore } from "@/features/loans/context/loans-store";
import LoanCard from "@/features/loans/presentation/components/LoanCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoansView() {
  const { filteredLoans, activeTab, setActiveTab } = useLoanStore();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de préstamos</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="returned">Devueltos</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLoans.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
      </div>
    </div>
  );
}

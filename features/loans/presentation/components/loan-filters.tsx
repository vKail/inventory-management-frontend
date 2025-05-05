'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useLoanFilter } from '@/features/loans/hooks/use-loan-filter';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';

interface LoanFiltersProps {
  loans: Loan[];
  onFilter: (filtered: Loan[]) => void;
}

export default function LoanFilters({ loans, onFilter }: LoanFiltersProps) {
  const {
    filteredLoans,
    filterByTab,
    filterBySearch,
    activeTab,
    searchQuery,
  } = useLoanFilter(loans);

  useEffect(() => {
    onFilter(filteredLoans);
  }, [filteredLoans, onFilter]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="search"
          placeholder="Buscar por nombre, código o usuario..."
          value={searchQuery}
          onChange={(e) => filterBySearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>

      <Tabs value={activeTab} onValueChange={filterByTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="returned">Devueltos</TabsTrigger>
          <TabsTrigger value="overdue">Vencidos</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}

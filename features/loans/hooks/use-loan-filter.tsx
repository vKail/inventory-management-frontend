'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';

interface UseLoanFilterResult {
  filteredLoans: Loan[];
  filterByTab: (tab: string) => void;
  filterBySearch: (query: string) => void;
  activeTab: string;
  searchQuery: string;
}

export function useLoanFilter(loans: Loan[]): UseLoanFilterResult {
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>(loans);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filter = useCallback(() => {
    let result = [...loans];

    // Filtrado por pestaña
    if (activeTab !== 'all') {
      result = result.filter((loan) => loan.status === activeTab);
    }

    // Filtrado por búsqueda
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((loan) => {
        const productMatch = loan.product?.name.toLowerCase().includes(lowerQuery) || loan.product?.barcode.toLowerCase().includes(lowerQuery);
        const userMatch = loan.user?.name.toLowerCase().includes(lowerQuery) || loan.user?.studentId?.toLowerCase().includes(lowerQuery);
        return productMatch || userMatch;
      });
    }

    setFilteredLoans(result);
  }, [loans, activeTab, searchQuery]);

  useEffect(() => {
    filter();
  }, [filter]);

  const filterByTab = (tab: string) => setActiveTab(tab);

  const filterBySearch = (query: string) => setSearchQuery(query);

  return {
    filteredLoans,
    filterByTab,
    filterBySearch,
    activeTab,
    searchQuery,
  };
}

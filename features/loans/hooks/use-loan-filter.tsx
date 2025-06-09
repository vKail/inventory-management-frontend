'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loan } from '@/features/loans/data/interfaces/loan.interface';

type SortOption =
  | 'startDateDesc'
  | 'startDateAsc'
  | 'nameAsc'
  | 'nameDesc';

interface UseLoanFilterResult {
  filteredLoans: Loan[];
  filterByTab: (tab: string) => void;
  filterBySearch: (query: string) => void;
  activeTab: string;
  searchQuery: string;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}
/**
 * Hook personalizado para manejar el filtrado y ordenamiento de préstamos
 * @param {Loan[]} loans - Lista de préstamos a filtrar
 * @returns {UseLoanFilterResult} Objeto con los estados y funciones de filtrado
 */
export function useLoanFilter(loans: Loan[]): UseLoanFilterResult {
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>(loans);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('startDateDesc');

  /**
   * Función que aplica los filtros y ordenamiento a la lista de préstamos
   * @returns {void}
   */
  const filter = useCallback(() => {
    let result = [...loans];

    // Filtro por estado del préstamo
    if (activeTab !== 'all') {
      result = result.filter((loan) => loan.status === activeTab);
    }

    // Filtro por texto de búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((loan) => {
        const productMatch =
          loan.product?.name.toLowerCase().includes(q) ||
          loan.product?.barcode.toLowerCase().includes(q);
        const userMatch =
          loan.user?.name.toLowerCase().includes(q) ||
          loan.user?.studentId?.toLowerCase().includes(q);
        return productMatch || userMatch;
      });
    }
    // Ordenamiento de resultados
    result.sort((a, b) => {
      switch (sortBy) {
        case 'startDateAsc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'startDateDesc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'nameAsc':
          return (a.product?.name || '').localeCompare(b.product?.name || '');
        case 'nameDesc':
          return (b.product?.name || '').localeCompare(a.product?.name || '');
        default:
          return 0;
      }
    });
    setFilteredLoans(result);
  }, [loans, activeTab, searchQuery, sortBy]);

  useEffect(() => {
    filter();
  }, [filter]);
  return {
    filteredLoans,
    filterByTab: setActiveTab,
    filterBySearch: setSearchQuery,
    activeTab,
    searchQuery,
    sortBy,
    setSortBy,
  };
}

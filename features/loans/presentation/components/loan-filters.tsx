"use client";

import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { useLoanFilter } from "@/features/loans/hooks/use-loan-filter";
import { Loan } from "@/features/loans/data/interfaces/loan.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
    sortBy,
    setSortBy,
  } = useLoanFilter(loans);

  useEffect(() => {
    onFilter(filteredLoans);
  }, [filteredLoans, onFilter]);

  return (
    <div className="space-y-4 bg-white p-4 rounded-md border shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar por nombre, código o usuario..."
            value={searchQuery}
            onChange={(e) => filterBySearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-40 h-10">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startDateDesc">Más reciente</SelectItem>
            <SelectItem value="startDateAsc">Más antiguo</SelectItem>
            <SelectItem value="nameAsc">Nombre A-Z</SelectItem>
            <SelectItem value="nameDesc">Nombre Z-A</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="h-10 w-10">
          <Filter className="h-5 w-5" />
        </Button>
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

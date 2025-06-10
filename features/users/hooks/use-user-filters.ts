"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserStore } from '../context/user-store';

interface UserFilters {
  userName?: string;
  dni?: string;
  status?: string;
}

export function useUserFilters(currentPage: number, itemsPerPage: number) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<UserFilters>({});
  const [totalPages, setTotalPages] = useState(1);
  const { getUsers } = useUserStore();

  // Leer parámetros de la URL al cargar el componente
  useEffect(() => {
    const userName = searchParams.get('userName');
    const dni = searchParams.get('dni');
    const status = searchParams.get('status');

    const urlFilters: UserFilters = {};

    if (userName) urlFilters.userName = userName;
    if (dni) urlFilters.dni = dni;
    if (status) urlFilters.status = status;

    setFilters(urlFilters);
  }, [searchParams]);

  const loadUsers = useCallback(async (page: number, currentFilters: UserFilters) => {
    try {
      const response = await getUsers(page, itemsPerPage, currentFilters);
      setTotalPages(response.pages);
      return response;
    } catch {
      setTotalPages(1);
      throw new Error('Error al cargar usuarios');
    }
  }, [getUsers, itemsPerPage]);

  useEffect(() => {
    loadUsers(currentPage, filters);
  }, [currentPage, filters, loadUsers]);

  const handleFilterChange = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);

    // Actualizar URL con los nuevos filtros
    const params = new URLSearchParams(searchParams);
    params.delete('userName');
    params.delete('dni');
    params.delete('status');
    params.delete('page'); // Reset a la primera página cuando cambian los filtros

    if (newFilters.userName) {
      params.set('userName', newFilters.userName);
    }
    if (newFilters.dni) {
      params.set('dni', newFilters.dni);
    }
    if (newFilters.status) {
      params.set('status', newFilters.status);
    }

    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  return {
    filters,
    totalPages,
    handleFilterChange,
    loadUsers
  };
}
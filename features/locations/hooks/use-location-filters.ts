import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocationStore } from '../context/location-store';

interface LocationFilters {
  name: string;
  floor: string;
  type: string;
}

export const useLocationFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getLocations } = useLocationStore();

  const [filters, setFilters] = useState<LocationFilters>({
    name: searchParams.get('name') || '',
    floor: searchParams.get('floor') || '',
    type: searchParams.get('type') || 'ALL',
  });

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1')
  );
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const updateURL = useCallback((newFilters: LocationFilters, page: number) => {
    const params = new URLSearchParams();

    if (newFilters.name) {
      params.set('name', newFilters.name);
    }
    if (newFilters.floor) {
      params.set('floor', newFilters.floor);
    }
    if (newFilters.type && newFilters.type !== 'ALL') {
      params.set('type', newFilters.type);
    }
    if (page > 1) {
      params.set('page', page.toString());
    }

    router.push(`?${params.toString()}`);
  }, [router]);

  const loadLocations = useCallback(async (filtersToApply: LocationFilters, page: number) => {
    const serviceFilters: { name?: string; floor?: string; type?: string } = {};

    if (filtersToApply.name) {
      serviceFilters.name = filtersToApply.name;
    }
    if (filtersToApply.floor) {
      serviceFilters.floor = filtersToApply.floor;
    }
    if (filtersToApply.type && filtersToApply.type !== 'ALL') {
      serviceFilters.type = filtersToApply.type;
    }

    const response = await getLocations(page, itemsPerPage, serviceFilters);
    setTotalPages(Math.ceil(response.total / itemsPerPage));
  }, [getLocations, itemsPerPage]);

  useEffect(() => {
    loadLocations(filters, currentPage);
  }, [filters, currentPage, loadLocations]);

  const handleSearch = useCallback((newFilters: LocationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1);
  }, [updateURL]);

  const handleClear = useCallback(() => {
    const clearedFilters: LocationFilters = {
      name: '',
      floor: '',
      type: 'ALL',
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateURL(clearedFilters, 1);
  }, [updateURL]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateURL(filters, page);
  }, [filters, updateURL]);

  return {
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    handleSearch,
    handleClear,
    handlePageChange,
  };
};

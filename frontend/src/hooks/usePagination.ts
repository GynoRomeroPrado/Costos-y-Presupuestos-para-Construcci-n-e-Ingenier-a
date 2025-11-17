import { useState, useMemo } from 'react';
import { PAGINATION } from '../constants';

interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  totalItems?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  startIndex: number;
  endIndex: number;
  setPageSize: (size: number) => void;
}

/**
 * Hook reutilizable para manejar lógica de paginación
 */
export function usePagination({
  initialPage = 1,
  pageSize: initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  totalItems = 0,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / pageSize) || 1;
  }, [totalItems, pageSize]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(startIndex + pageSize, totalItems);
  }, [startIndex, pageSize, totalItems]);

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSetPageSize = (size: number) => {
    setPageSize(size);
    // Ajustar página actual si es necesario
    const newTotalPages = Math.ceil(totalItems / size);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    startIndex,
    endIndex,
    setPageSize: handleSetPageSize,
  };
}

/**
 * Hook para filtrar array localmente con paginación
 */
export function useLocalPagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
) {
  const pagination = usePagination({
    ...options,
    totalItems: items.length,
  });

  const paginatedItems = useMemo(() => {
    return items.slice(pagination.startIndex, pagination.endIndex);
  }, [items, pagination.startIndex, pagination.endIndex]);

  return {
    items: paginatedItems,
    ...pagination,
  };
}

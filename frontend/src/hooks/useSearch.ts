import { useState, useMemo } from 'react';
import { useDebounce } from './usePerformance';

interface UseSearchOptions<T> {
  searchFields: (keyof T)[];
  debounceMs?: number;
}

interface UseSearchReturn<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  filteredItems: T[];
  clearSearch: () => void;
}

/**
 * Hook para búsqueda y filtrado de items
 * Soporta búsqueda en múltiples campos con debounce
 */
export function useSearch<T>(
  items: T[],
  options: UseSearchOptions<T>
): UseSearchReturn<T> {
  const { searchFields, debounceMs = 300 } = options;
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const filteredItems = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return items;
    }

    const search = debouncedSearchTerm.toLowerCase();

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;

        return String(value).toLowerCase().includes(search);
      });
    });
  }, [items, debouncedSearchTerm, searchFields]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    filteredItems,
    clearSearch,
  };
}

/**
 * Hook para filtrado avanzado con múltiples criterios
 */
export function useFilter<T>(
  items: T[],
  filters: Partial<Record<keyof T, any>>
): T[] {
  return useMemo(() => {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return true; // Ignora filtros vacíos
        }

        const itemValue = item[key as keyof T];
        return itemValue === value;
      });
    });
  }, [items, filters]);
}

/**
 * Hook combinado para búsqueda + filtrado
 */
export function useSearchAndFilter<T>(
  items: T[],
  searchOptions: UseSearchOptions<T>,
  filters: Partial<Record<keyof T, any>> = {}
) {
  // Primero aplicar filtros
  const filteredByFilters = useFilter(items, filters);

  // Luego aplicar búsqueda sobre los items filtrados
  const searchResult = useSearch(filteredByFilters, searchOptions);

  return {
    ...searchResult,
    totalItems: items.length,
    filteredCount: searchResult.filteredItems.length,
  };
}

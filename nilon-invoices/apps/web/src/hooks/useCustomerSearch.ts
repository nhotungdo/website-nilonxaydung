import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { customersApi } from '@/services/api';

export function useCustomerSearch(debounceMs = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(t);
  }, [query, debounceMs]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['customers', 'search', debouncedQuery],
    queryFn: () => customersApi.search(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 1000 * 60, // 1 minute
  });

  const customers = useMemo(() => data?.data ?? [], [data?.data]);

  return {
    query,
    setQuery,
    customers,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}

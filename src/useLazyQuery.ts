import type { LazyFetch, LazyQueryHookOptions, QueryHookOptions } from './types';
import { useQuery } from './useQuery';

const useLazyQuery = <TData, TKey = unknown, TParams = unknown>(
  key: TKey,
  options: LazyQueryHookOptions<TData, TKey, TParams>
) => {
  const { refetch, ...rest } = useQuery<TData, TKey>(key, {
    ...(options as QueryHookOptions<TData, TKey>),
    enabled: false
  });

  return [refetch as LazyFetch<TData, TParams>, rest] as const;
};

export { useLazyQuery };

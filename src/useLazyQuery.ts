import type { FetchTrigger, LazyQueryHookOptions, QueryHookOptions } from './types';
import { useQuery } from './useQuery';

const useLazyQuery = <TData, TParams, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TKey, TParams>
) => {
  const { refetch, ...rest } = useQuery<TData, TKey>({
    ...(options as QueryHookOptions<TData, TKey>),
    enabled: false
  });

  return [refetch as FetchTrigger<TData, TParams>, rest] as const;
};

export { useLazyQuery };

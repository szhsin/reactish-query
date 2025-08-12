import type { QueryTrigger, LazyQueryHookOptions, QueryHookOptions } from './types';
import { useQuery } from './useQuery';

const useLazyQuery = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TKey, TArgs>
) => {
  const { refetch, ...rest } = useQuery<TData, TKey>({
    ...(options as QueryHookOptions<TData, TKey>),
    enabled: false
  });

  return [refetch as QueryTrigger<TData, TArgs>, rest] as const;
};

export { useLazyQuery };

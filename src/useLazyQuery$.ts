import type { QueryTrigger, LazyQueryHookOptions, QueryHookOptions } from './types';
import { useQuery$ } from './useQuery$';

const useLazyQuery$ = <TData, TArgs, TKey = unknown>(
  options: LazyQueryHookOptions<TData, TArgs, TKey>
) => {
  const { refetch, ...rest } = useQuery$<TData, TKey>({
    ...(options as QueryHookOptions<TData, TKey>),
    enabled: false
  });

  return { ...rest, trigger: refetch as QueryTrigger<TData, TArgs> };
};

export { useLazyQuery$ };

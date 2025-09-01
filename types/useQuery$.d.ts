import type { Refetch, QueryHookOptions } from './types';
import type { InternalHookApi } from './types-internal';
declare const useQuery$: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => {
    refetch: Refetch<TData>;
} & InternalHookApi<TData>;
export { useQuery$ };

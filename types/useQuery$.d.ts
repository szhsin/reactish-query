import type { Refetch, QueryHookOptions } from './types';
import type { InternalHookApi } from './types-internal';
declare const useQuery$: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: InternalHookApi<TData>;
    refetch: Refetch<TData>;
};
export { useQuery$ };

import type { Refetch, QueryHookOptions } from './types';
declare const useQuery$: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => {
    /** @internal Observable query state */
    _: import("./types-internal").CacheEntryState<TData>;
    refetch: Refetch<TData>;
};
export { useQuery$ };

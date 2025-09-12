import type { QueryHookOptions } from './types';
/**
 * Convenience hook that returns only `data` and `isPending` from `useQuery$`.
 * Useful for components that only care about the query result and pending
 * state, and don't need `error` or `isFetching`.
 */
declare const useQueryData: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    refetch: import("./types").Refetch<TData>;
} & import("./types-internal").InternalHookApi<TData> & import("./types").QueryDataState<TData>;
export { useQueryData };

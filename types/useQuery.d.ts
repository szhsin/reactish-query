import type { QueryHookOptions } from './types';
declare const useQuery: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    _: import("./types-internal").CacheEntryState<TData>;
    refetch: import("./types").Refetch<TData>;
} & {
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>);
export { useQuery };

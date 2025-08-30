import type { QueryHookOptions } from './types';
declare const useQueryData: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    _: import("./types-internal").CacheEntryState<TData>;
    refetch: import("./types").Refetch<TData>;
} & import("./types").QueryDataState<TData>;
export { useQueryData };

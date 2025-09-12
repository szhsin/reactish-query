import type { LazyQueryHookOptions } from './types';
/**
 * Hook for lazy queries. Returns the same observable API as `useQuery`, but
 * does not trigger an initial fetch. Use the returned `trigger` to execute the
 * query with arguments.
 */
declare const useLazyQuery: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TArgs, TKey>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    _: {
        s: import("./types-internal").CacheEntryState<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
    };
} & {
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>);
export { useLazyQuery };

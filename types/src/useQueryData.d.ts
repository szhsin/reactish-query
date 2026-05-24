import type { QueryHookOptions } from './types';
/**
 * Convenience hook that exposes only `data` and `isPending` from a query.
 *
 * The returned state is **render-ready** and can be used directly in React
 * components. Useful when you only care about the query result and
 * pending state, without `error` or `isFetching`. Optimized for finer-grained reactivity.
 *
 * @returns An object containing:
 *  - `data` — the current query data
 *  - `isPending` — whether the query is pending
 *  - `refetch` — function to manually refetch the query
 *
 * @example
 * const { data, isPending } = useQueryData({ queryKey: 'todos', queryFn });
 */
declare const useQueryData: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    refetch: () => Promise<import("./types").FetchResult<TData>>;
    _: {
        s: import("./types-internal").CacheEntryImmutable<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown, unknown>;
        f: (args: unknown, declarative: boolean) => Promise<import("./types").FetchResult<TData>> | undefined;
        queryKeyForInferOnly?: TKey | undefined;
    };
} & import("./types").QueryDataState<TData>;
export { useQueryData };

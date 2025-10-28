import type { QueryHookOptions } from './types';
/**
 * React hook that exposes the full query state for rendering.
 *
 * Unlike low-level `$` hooks, the returned state is **ready to use in
 * React render paths**.
 *
 * @returns An object containing:
 *  - `data` — the current query data
 *  - `error` — the current query error
 *  - `isFetching` — whether the query is actively fetching
 *  - `isPending` — whether the query is pending
 *  - `refetch` — function to manually refetch the query
 */
declare const useQuery: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    refetch: () => Promise<import("./types").FetchResult<TData>>;
    _: {
        s: import("./types-internal").CacheEntryImmutable<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown, unknown>;
        f: (args: unknown, declarative: boolean) => Promise<import("./types").FetchResult<TData>> | undefined;
        queryKeyForInferOnly?: TKey | undefined;
    };
} & {
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>);
export { useQuery };

import type { LazyQueryHookOptions } from './types';
/**
 * Hook for lazy queries. Returns the same render-ready state as `useQuery`,
 * but does not trigger a declarative (auto) fetch. Use the returned `trigger`
 * to execute the query with arguments.
 *
 * @returns An object containing:
 *  - `trigger` — function to manually execute the query
 *  - `args` — the most recent arguments passed to `trigger`
 *  - `data` — current query result
 *  - `error` — current query error
 *  - `isFetching` — whether the query is in progress
 *  - `isPending` — whether the query is pending
 */
declare const useLazyQuery: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TArgs, TKey>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    args: TArgs | undefined;
    _: {
        s: import("./types-internal").CacheEntryImmutable<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
        f: (args: unknown, declarative: boolean) => Promise<import("./types").FetchResult<TData>> | undefined;
    };
} & {
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>);
export { useLazyQuery };

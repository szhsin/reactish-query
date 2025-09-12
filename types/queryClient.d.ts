import type { CacheQueryFn, FetchResult, QueryMeta, QueryStateMiddleware } from './types';
import type { QueryCacheEntry } from './types-internal';
/**
 * Create a query client instance.
 *
 * @param options.middleware Optional middleware used when creating per-query state.
 * @returns An object with methods to interact with the query cache and lifecycle.
 */
declare const createQueryClient: ({ middleware }?: {
    middleware?: QueryStateMiddleware;
}) => {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: readonly [<TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined) => QueryCacheEntry<TData>, <TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined, shouldPersist: boolean, strQueryKey?: string) => QueryCacheEntry<TData>];
    /**
     * Clear the entire query cache.
     */
    clear: () => void;
    /**
     * Read cached data for a query. Returns `undefined` when not present.
     *
     * NOTE: this returns the current cached value as a plain (non-reactive)
     * snapshot. It should NOT be used directly in render paths.
     */
    getData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => TData | undefined;
    /**
     * Set cached data for a query. Accepts a value or an updater function.
     *
     * NOTE: Setting data to `undefined` is not supported,
     * as that represents the initial state with `isPending = true`.
     * If your data can be `undefined`, include it in the `TData` type parameter.
     */
    setData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>, data: TData | ((prevData: TData) => TData)) => void;
    /**
     * Mark any in-flight fetch for the given query meta as canceled. Corresponding
     * stale responses will be ignored.
     */
    cancel: <TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => void;
    /**
     * Fetch data for a query and update the cache. If a cache entry exists,
     * it will be used; otherwise a new entry is created and persisted when
     * appropriate.
     *
     * This method can be used to prefetch a query and warm up the cache when needed.
     */
    fetch: <TData, TKey = unknown, TArgs = unknown>({ queryFn, ...queryMeta }: QueryMeta<TKey, TArgs> & {
        queryFn: CacheQueryFn<TData, TKey, TArgs>;
    }) => Promise<FetchResult<TData>>;
    /**
     * Invalidate a cached query which trigger a refetch, when a cache entry existed. Returns
     * the fetch result.
     */
    invalidate: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => Promise<FetchResult<TData>> | void;
};
declare const defaultQueryClient: {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: readonly [<TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined) => QueryCacheEntry<TData>, <TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined, shouldPersist: boolean, strQueryKey?: string) => QueryCacheEntry<TData>];
    /**
     * Clear the entire query cache.
     */
    clear: () => void;
    /**
     * Read cached data for a query. Returns `undefined` when not present.
     *
     * NOTE: this returns the current cached value as a plain (non-reactive)
     * snapshot. It should NOT be used directly in render paths.
     */
    getData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => TData | undefined;
    /**
     * Set cached data for a query. Accepts a value or an updater function.
     *
     * NOTE: Setting data to `undefined` is not supported,
     * as that represents the initial state with `isPending = true`.
     * If your data can be `undefined`, include it in the `TData` type parameter.
     */
    setData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>, data: TData | ((prevData: TData) => TData)) => void;
    /**
     * Mark any in-flight fetch for the given query meta as canceled. Corresponding
     * stale responses will be ignored.
     */
    cancel: <TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => void;
    /**
     * Fetch data for a query and update the cache. If a cache entry exists,
     * it will be used; otherwise a new entry is created and persisted when
     * appropriate.
     *
     * This method can be used to prefetch a query and warm up the cache when needed.
     */
    fetch: <TData, TKey = unknown, TArgs = unknown>({ queryFn, ...queryMeta }: QueryMeta<TKey, TArgs> & {
        queryFn: CacheQueryFn<TData, TKey, TArgs>;
    }) => Promise<FetchResult<TData>>;
    /**
     * Invalidate a cached query which trigger a refetch, when a cache entry existed. Returns
     * the fetch result.
     */
    invalidate: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => Promise<FetchResult<TData>> | void;
};
type QueryClient = typeof defaultQueryClient;
/**
 * Default shared query client instance used when no client is provided via
 * QueryProvider.
 */
export { createQueryClient, defaultQueryClient, type QueryClient };

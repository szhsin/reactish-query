import { createState } from 'reactish-state';
import type { StateBuilder, Middleware } from 'reactish-state';
import type {
  CacheQueryFn,
  FetchResult,
  QueryMeta,
  QueryStateKey,
  QueryStateMiddleware,
  MiddlewareMeta
} from './types';
import type { QueryCacheEntry } from './types-internal';
import { createCache } from './cache';
import { getStrCacheKey, fetchCacheEntry } from './queryCacheUtils';
import { UNDEFINED } from './utils';

/**
 * Create a query client instance.
 *
 * @param options.middleware Optional middleware used when creating per-query state.
 * @returns An object with methods to interact with the query cache and lifecycle.
 */
const createQueryClient = ({
  middleware
}: { middleware?: QueryStateMiddleware } = {}) => {
  const state: StateBuilder<MiddlewareMeta> = createState({
    middleware: middleware as Middleware<QueryMeta>
  });

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const cache = createCache<QueryCacheEntry<any>>();

  const getCacheEntry = <TData, TKey = unknown, TArgs = unknown>(
    queryMeta: QueryMeta<TKey, TArgs>
  ) => cache.get(getStrCacheKey(queryMeta)) as QueryCacheEntry<TData> | undefined;

  const createInitialState = (
    queryMeta: QueryMeta,
    stateKey: QueryStateKey,
    initialValue?: unknown
  ) => state(initialValue, UNDEFINED, { ...queryMeta, stateKey });

  const createDefaultCacheEntry = <TData>(
    queryMeta: QueryMeta,
    queryFn: CacheQueryFn<TData> | undefined
  ) =>
    [
      {
        d: createInitialState(queryMeta, 'data'),
        e: createInitialState(queryMeta, 'error'),
        f: createInitialState(queryMeta, 'isFetching', false),
        p: createInitialState(queryMeta, 'isPending', true)
      },
      { i: 0, fn: queryFn }
    ] as QueryCacheEntry<TData>;

  const resovleCacheEntry = <TData>(
    queryMeta: QueryMeta,
    queryFn: CacheQueryFn<TData> | undefined,
    shouldPersist: boolean,
    strQueryKey?: string
  ) => {
    const strCacheKey = getStrCacheKey(queryMeta, strQueryKey);

    let cacheEntry: QueryCacheEntry<TData> | undefined = cache.get(
      strCacheKey,
      shouldPersist
    );
    if (!cacheEntry) {
      cacheEntry = createDefaultCacheEntry(queryMeta, queryFn);
      cache.set(strCacheKey, cacheEntry, shouldPersist);
    }
    if (queryFn) cacheEntry[1].fn = queryFn;

    return cacheEntry;
  };

  return {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: [createDefaultCacheEntry, resovleCacheEntry] as const,

    /**
     * Clear the entire query cache.
     */
    clear: () => cache.clear(),

    /**
     * Read cached data for a query. Returns `undefined` when not present.
     *
     * NOTE: this returns the current cached value as a plain (non-reactive)
     * snapshot. It should NOT be used directly in render paths.
     */
    getData: <TData, TKey = unknown, TArgs = unknown>(
      queryMeta: QueryMeta<TKey, TArgs>
    ): TData | undefined => getCacheEntry<TData>(queryMeta)?.[0].d.get(),

    /**
     * Set cached data for a query. Accepts a value or an updater function.
     *
     * NOTE: Setting data to `undefined` is not supported,
     * as that represents the initial state with `isPending = true`.
     * If your data can be `undefined`, include it in the `TData` type parameter.
     */
    setData: <TData, TKey = unknown, TArgs = unknown>(
      queryMeta: QueryMeta<TKey, TArgs>,
      data: TData | ((prevData: TData) => TData)
    ): void => getCacheEntry(queryMeta)?.[0].d.set(data),

    /**
     * Mark any in-flight fetch for the given query meta as canceled. Corresponding
     * stale responses will be ignored.
     */
    cancel: <TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => {
      const cacheEntry = getCacheEntry(queryMeta);
      if (cacheEntry) {
        cacheEntry[0].f.set(false);
        cacheEntry[1].i++;
      }
    },

    /**
     * Fetch data for a query and update the cache. If a cache entry exists,
     * it will be used; otherwise a new entry is created and persisted when
     * appropriate.
     *
     * This method can be used to prefetch a query and warm up the cache when needed.
     */
    fetch: <TData, TKey = unknown, TArgs = unknown>({
      queryFn,
      ...queryMeta
    }: QueryMeta<TKey, TArgs> & { queryFn: CacheQueryFn<TData, TKey, TArgs> }): Promise<
      FetchResult<TData>
    > =>
      fetchCacheEntry(
        queryMeta,
        resovleCacheEntry(queryMeta, queryFn as CacheQueryFn<TData>, true)
      ),

    /**
     * Invalidate a cached query which trigger a refetch, when a cache entry existed. Returns
     * the fetch result.
     */
    invalidate: <TData, TKey = unknown, TArgs = unknown>(
      queryMeta: QueryMeta<TKey, TArgs>
    ): Promise<FetchResult<TData>> | void => {
      const cacheEntry = getCacheEntry<TData>(queryMeta);
      if (cacheEntry) return fetchCacheEntry(queryMeta, cacheEntry);
    }
  };
};

const defaultQueryClient = createQueryClient();

type QueryClient = typeof defaultQueryClient;

/**
 * Default shared query client instance used when no client is provided via
 * QueryProvider.
 */
export { createQueryClient, defaultQueryClient, type QueryClient };

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

    clear: () => cache.clear(),

    getData: <TData, TKey = unknown, TArgs = unknown>(
      queryMeta: QueryMeta<TKey, TArgs>
    ): TData | undefined => getCacheEntry<TData>(queryMeta)?.[0].d.get(),

    setData: <TData, TKey = unknown, TArgs = unknown>(
      queryMeta: QueryMeta<TKey, TArgs>,
      // This function does not support setting data to undefined, as that represents the initial state with isPending = true.
      // If your data can be undefined, add `undefined` to the TData type parameter.
      data: TData | ((prevData: TData) => TData)
    ): void => getCacheEntry(queryMeta)?.[0].d.set(data),

    cancel: <TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => {
      const cacheEntry = getCacheEntry(queryMeta);
      if (cacheEntry) {
        cacheEntry[0].f.set(false);
        cacheEntry[1].i++;
      }
    },

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

export { createQueryClient, defaultQueryClient, type QueryClient };

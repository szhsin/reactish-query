import type { CacheQueryFn, FetchResult, QueryMeta, QueryStateMiddleware } from './types';
import type { QueryCacheEntry } from './types-internal';
declare const createQueryClient: ({ middleware }?: {
    middleware?: QueryStateMiddleware;
}) => {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: readonly [<TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined) => QueryCacheEntry<TData>, <TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined, shouldPersist: boolean, strQueryKey?: string) => QueryCacheEntry<TData>];
    clearCache: () => void;
    getData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => TData | undefined;
    setData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>, data: TData) => void;
    cancel: <TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => void;
    fetch: <TData, TKey = unknown, TArgs = unknown>({ queryFn, ...queryMeta }: QueryMeta<TKey, TArgs> & {
        queryFn: CacheQueryFn<TData, TKey, TArgs>;
    }) => Promise<FetchResult<TData>>;
    invalidate: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => Promise<FetchResult<TData>> | void;
};
declare const defaultQueryClient: {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: readonly [<TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined) => QueryCacheEntry<TData>, <TData>(queryMeta: QueryMeta, queryFn: CacheQueryFn<TData> | undefined, shouldPersist: boolean, strQueryKey?: string) => QueryCacheEntry<TData>];
    clearCache: () => void;
    getData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => TData | undefined;
    setData: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>, data: TData) => void;
    cancel: <TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => void;
    fetch: <TData, TKey = unknown, TArgs = unknown>({ queryFn, ...queryMeta }: QueryMeta<TKey, TArgs> & {
        queryFn: CacheQueryFn<TData, TKey, TArgs>;
    }) => Promise<FetchResult<TData>>;
    invalidate: <TData, TKey = unknown, TArgs = unknown>(queryMeta: QueryMeta<TKey, TArgs>) => Promise<FetchResult<TData>> | void;
};
type QueryClient = typeof defaultQueryClient;
export { createQueryClient, defaultQueryClient, type QueryClient };

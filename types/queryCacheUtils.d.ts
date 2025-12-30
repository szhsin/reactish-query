import type { FetchResult, QueryMeta } from './types';
import type { QueryCacheEntry } from './types-internal';
export declare const getStrCacheKey: ({ queryKey, args }: QueryMeta, strQueryKey?: string) => string;
export declare const isDataFresh: <TData>(cacheEntry: QueryCacheEntry<TData>, staleTime?: number) => boolean;
export declare const fetchCacheEntry: <TData>(queryMeta: QueryMeta, [{ d: { set: setData }, e: { set: setError }, p: { set: setIsPending }, f: { set: setIsFetching } }, cacheEntryMutable]: QueryCacheEntry<TData>) => Promise<FetchResult<TData>>;

import type { QueryHookOptions, QueryHookResult } from './types';
declare const useQuery: <TData, TKey = unknown>({ key, fetcher, cacheMode, enabled }: QueryHookOptions<TData, TKey>) => QueryHookResult<TData>;
export { useQuery };

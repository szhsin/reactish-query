import type { QueryHookOptions, QueryHookResult } from './types';
declare const useQuery: <TData, TKey = unknown>({ queryKey, queryFn, cacheMode, enabled, staleTime }: QueryHookOptions<TData, TKey>) => QueryHookResult<TData>;
export { useQuery };

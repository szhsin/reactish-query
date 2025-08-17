import type { QueryHookOptions, QueryHookResult } from './types';
declare const useQuery: <TData, TKey = unknown>({ queryKey, queryFn, enabled, ...options }: QueryHookOptions<TData, TKey>) => QueryHookResult<TData>;
export { useQuery };

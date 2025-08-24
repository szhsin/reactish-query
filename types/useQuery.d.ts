import type { QueryHookOptions, QueryHookResult } from './types';
declare const useQuery: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => QueryHookResult<TData>;
export { useQuery };

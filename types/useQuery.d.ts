import type { QueryHookOptions, Refetch } from './types';
declare const useQuery: <TData, TKey = unknown>(key: TKey, { fetcher, enabled }?: QueryHookOptions<TData, TKey>) => {
    refetch: Refetch<TData>;
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
};
export { useQuery };

import type { QueryHookOptions, Refetch } from './types';
declare const useQuery: <TData, TKey = unknown>({ key, fetcher, cacheMode, enabled }: QueryHookOptions<TData, TKey>) => {
    refetch: Refetch<TData>;
    isLoading: boolean;
    data?: TData | undefined;
    error?: Error;
};
export { useQuery };

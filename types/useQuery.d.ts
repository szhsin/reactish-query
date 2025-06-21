export type Fetcher<TData, TKey = unknown> = (key: TKey) => Promise<TData>;
export type QueryHookOptions<TData, TKey = unknown> = {
    fetcher?: Fetcher<TData, TKey>;
};
export type QueryHookResult<TData> = {
    isLoading: boolean;
    data?: TData;
    error?: Error;
};
declare const useQuery: <TData, TKey = unknown>(key: TKey, { fetcher }?: QueryHookOptions<TData, TKey>) => QueryHookResult<TData>;
export { useQuery };

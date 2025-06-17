type QueryHookOptions<TData> = {
    fetcher?: () => Promise<TData>;
};
type QueryHookResult<TData> = {
    isLoading: boolean;
    data?: TData;
    error?: Error;
};
declare const useQuery: <TData>(key: unknown, { fetcher }?: QueryHookOptions<TData>) => QueryHookResult<TData>;
export { useQuery };

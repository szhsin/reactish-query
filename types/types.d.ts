export interface QueryState<TData> {
    isLoading: boolean;
    data?: TData;
    error?: Error;
}
export type Fetcher<TData, TKey> = (key: TKey) => Promise<TData>;
export type LazyFetcher<TData, TKey, TParams> = (key: TKey, params: TParams) => Promise<TData>;
export type Refetch<TData> = () => Promise<QueryState<TData>>;
export type LazyFetch<TData, TParams> = (params: TParams) => Promise<QueryState<TData>>;
export interface BaseQueryHookOptions {
    cacheMode?: 'auto' | 'persist' | 'off';
}
export interface QueryHookOptions<TData, TKey> extends BaseQueryHookOptions {
    fetcher?: Fetcher<TData, TKey>;
    enabled?: boolean;
}
export interface LazyQueryHookOptions<TData, TKey, TParams> extends BaseQueryHookOptions {
    fetcher: LazyFetcher<TData, TKey, TParams>;
}

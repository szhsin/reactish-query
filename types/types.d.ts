export interface QueryStatePending {
    isPending: true;
    isFetching: boolean;
    data?: undefined;
    error?: undefined;
}
export interface QueryStateSuccess<TData> {
    isPending: false;
    isFetching: boolean;
    data: TData;
    error?: undefined;
}
export interface QueryStateError {
    isPending: false;
    isFetching: boolean;
    data?: undefined;
    error: Error;
}
export type QueryResult<TData> = QueryStatePending | QueryStateSuccess<TData> | QueryStateError;
export type QueryState<TData> = Omit<QueryResult<TData>, 'isPending'>;
export interface QueryMeta<TKey = unknown, TArgs = unknown> {
    queryKey?: TKey;
    args?: TArgs;
}
export type QueryFn<TData, TKey> = (options: {
    queryKey: TKey;
}) => Promise<TData>;
export type LazyQueryFn<TData, TKey, TArgs> = (options: {
    queryKey?: TKey;
    args: TArgs;
}) => Promise<TData>;
export type Refetch<TData> = () => Promise<QueryState<TData>>;
export type QueryTrigger<TData, TArgs> = (args: TArgs) => Promise<QueryState<TData>>;
export type QueryHookResult<TData> = QueryResult<TData> & {
    refetch: Refetch<TData>;
};
export interface BaseQueryHookOptions {
    cacheMode?: 'auto' | 'persist' | 'off';
}
export interface QueryHookOptions<TData, TKey> extends BaseQueryHookOptions {
    queryKey: TKey;
    queryFn?: QueryFn<TData, TKey>;
    enabled?: boolean;
    staleTime?: number;
}
export interface LazyQueryHookOptions<TData, TKey, TArgs> extends BaseQueryHookOptions {
    queryKey?: TKey;
    queryFn: LazyQueryFn<TData, TKey, TArgs>;
}
export type MutationHookOptions<TData, TKey, TArgs> = Omit<LazyQueryHookOptions<TData, TKey, TArgs>, 'cacheMode'>;

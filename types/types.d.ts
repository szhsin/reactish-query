import type { State, Setter } from 'reactish-state';
export type QueryStateKey = 'data' | 'error' | 'isFetching' | 'isPending';
export interface QueryDataPending {
    isPending: true;
    data: undefined;
}
export interface QueryDataSuccess<TData> {
    isPending: false;
    data: TData;
}
export type QueryDataState<TData> = QueryDataPending | QueryDataSuccess<TData>;
export type QueryMeta<TKey = unknown, TArgs = unknown> = {
    queryKey: TKey;
    args?: TArgs;
} | {
    queryKey?: TKey;
    args: TArgs;
};
export type QueryFn<TData, TKey> = (options: {
    queryKey: TKey;
    args: undefined;
}) => TData | Promise<TData>;
export type LazyQueryFn<TData, TKey, TArgs> = (options: {
    queryKey: TKey | undefined;
    args: TArgs;
}) => TData | Promise<TData>;
export type CacheQueryFn<TData, TKey = unknown, TArgs = unknown> = (queryMeta: QueryMeta<TKey, TArgs>) => TData | Promise<TData>;
export interface FetchResult<TData> {
    data?: TData;
    error?: Error;
}
export type Refetch<TData> = () => Promise<FetchResult<TData>>;
export type QueryTrigger<TData, TArgs> = (args: TArgs) => Promise<FetchResult<TData>>;
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
export type DefaultableOptions = Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'staleTime'>;
export type MiddlewareMeta<TKey = unknown, TArgs = unknown> = QueryMeta<TKey, TArgs> & {
    stateKey: QueryStateKey;
};
export interface QueryStateMiddleware {
    <TValue>(state: State<TValue>, meta: MiddlewareMeta): Setter<TValue>;
}
export interface QueryObserverOptions<TData> {
    onData?: (data: TData) => void;
    onError?: (error: Error) => void;
}

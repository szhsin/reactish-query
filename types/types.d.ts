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
export type QueryFn<TData, TKey> = (options: {
    queryKey: TKey;
}) => Promise<TData>;
export type LazyQueryFn<TData, TKey, TArgs> = (options: {
    queryKey?: TKey;
    args: TArgs;
}) => Promise<TData>;
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
export interface QueryStateMeta<TKey = unknown, TArgs = unknown> {
    queryKey?: TKey;
    args?: TArgs;
}
export interface MiddlewareMeta<TKey = unknown, TArgs = unknown> extends QueryStateMeta<TKey, TArgs> {
    stateKey: QueryStateKey;
}
export interface QueryStateMiddleware {
    <TValue>(state: State<TValue>, meta: MiddlewareMeta): Setter<TValue>;
}
export interface QueryObserverOptions<TData> {
    onData?: (data: TData) => void;
    onError?: (error: Error) => void;
}

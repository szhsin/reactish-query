import type { State, Setter } from 'reactish-state';
export type QueryStateKey = 'data' | 'error' | 'isFetching' | 'isPending';
type QueryDataPending = {
    isPending: true;
    data: undefined;
};
type QueryDataSuccess<TData> = {
    isPending: false;
    data: TData;
};
export type QueryDataState<TData> = QueryDataPending | QueryDataSuccess<TData>;
export type QueryMeta<TKey = unknown, TArgs = unknown> = {
    queryKey: TKey;
    args?: TArgs;
} | {
    queryKey?: TKey;
    args: TArgs;
};
export type QueryFn<TData, TKey = unknown> = (options: {
    queryKey: TKey;
    args: undefined;
}) => TData | Promise<TData>;
export type LazyQueryFn<TData, TArgs = unknown, TKey = unknown> = (options: {
    queryKey: TKey | undefined;
    args: TArgs;
}) => TData | Promise<TData>;
export type CacheQueryFn<TData, TKey = unknown, TArgs = unknown> = (queryMeta: QueryMeta<TKey, TArgs>) => TData | Promise<TData>;
export type FetchResult<TData> = {
    data?: TData;
    error?: Error;
};
export type Refetch<TData> = () => Promise<FetchResult<TData>>;
export type QueryTrigger<TData, TArgs> = (args: TArgs) => Promise<FetchResult<TData>>;
export type BaseQueryHookOptions = {
    cacheMode?: 'auto' | 'persist' | 'off';
};
export type QueryHookOptions<TData, TKey> = BaseQueryHookOptions & {
    queryKey: TKey;
    queryFn?: QueryFn<TData, TKey>;
    enabled?: boolean;
    staleTime?: number;
};
export type LazyQueryHookOptions<TData, TArgs, TKey> = BaseQueryHookOptions & {
    queryKey?: TKey;
    queryFn: LazyQueryFn<TData, TArgs, TKey>;
};
export type MutationHookOptions<TData, TArgs, TKey> = Omit<LazyQueryHookOptions<TData, TArgs, TKey>, 'cacheMode'>;
export type DefaultableOptions = Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'staleTime'>;
export type MiddlewareMeta<TKey = unknown, TArgs = unknown> = QueryMeta<TKey, TArgs> & {
    stateKey: QueryStateKey;
};
export interface QueryStateMiddleware {
    <TValue>(state: State<TValue>, meta: MiddlewareMeta): Setter<TValue>;
}
export type QueryObserverOptions<TData> = {
    onData?: (data: TData) => void;
    onError?: (error: Error) => void;
};
export {};

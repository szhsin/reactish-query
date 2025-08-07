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

export type QueryResult<TData> =
  | QueryStatePending
  | QueryStateSuccess<TData>
  | QueryStateError;

export type QueryState<TData> = Omit<QueryResult<TData>, 'isPending'>;

export interface QueryMeta<TKey = unknown, TParams = unknown> {
  key?: TKey;
  params?: TParams;
}

export type Fetcher<TData, TKey> = (options: { key: TKey }) => Promise<TData>;
export type LazyFetcher<TData, TKey, TParams> = (options: {
  key?: TKey;
  params: TParams;
}) => Promise<TData>;

export type Refetch<TData> = () => Promise<QueryState<TData>>;
export type FetchTrigger<TData, TParams> = (
  params: TParams
) => Promise<QueryState<TData>>;

export type QueryHookResult<TData> = QueryResult<TData> & {
  refetch: Refetch<TData>;
};

export interface BaseQueryHookOptions {
  cacheMode?: 'auto' | 'persist' | 'off';
}

export interface QueryHookOptions<TData, TKey> extends BaseQueryHookOptions {
  key: TKey;
  fetcher?: Fetcher<TData, TKey>;
  enabled?: boolean;
  staleTime?: number;
}

export interface LazyQueryHookOptions<TData, TKey, TParams> extends BaseQueryHookOptions {
  key?: TKey;
  fetcher: LazyFetcher<TData, TKey, TParams>;
}

export type MutationHookOptions<TData, TKey, TParams> = Omit<
  LazyQueryHookOptions<TData, TKey, TParams>,
  'cacheMode'
>;

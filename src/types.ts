export interface QueryState<TData> {
  isLoading: boolean;
  data?: TData;
  error?: Error;
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

export interface BaseQueryHookOptions {
  cacheMode?: 'auto' | 'persist' | 'off';
}

export interface QueryHookOptions<TData, TKey> extends BaseQueryHookOptions {
  key: TKey;
  fetcher?: Fetcher<TData, TKey>;
  enabled?: boolean;
}

export interface LazyQueryHookOptions<TData, TKey, TParams> extends BaseQueryHookOptions {
  key?: TKey;
  fetcher: LazyFetcher<TData, TKey, TParams>;
}

export type MutationHookOptions<TData, TKey, TParams> = Omit<
  LazyQueryHookOptions<TData, TKey, TParams>,
  'cacheMode'
>;

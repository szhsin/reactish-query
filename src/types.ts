export type QueryState<TData> = {
  isLoading: boolean;
  data?: TData;
  error?: Error;
};

export type Fetcher<TData, TKey> = (key: TKey) => Promise<TData>;
export type LazyFetcher<TData, TKey, TParams> = (
  key: TKey,
  params: TParams
) => Promise<TData>;

export type Refetch<TData> = () => Promise<QueryState<TData>>;
export type LazyFetch<TData, TParams> = (params: TParams) => Promise<QueryState<TData>>;

export type QueryHookOptions<TData, TKey> = {
  fetcher?: Fetcher<TData, TKey>;
  enabled?: boolean;
};
export type LazyQueryHookOptions<TData, TKey, TParams> = {
  fetcher: LazyFetcher<TData, TKey, TParams>;
};

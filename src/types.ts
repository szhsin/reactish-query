import type { State, Setter } from 'reactish-state';

/**
 * Keys for per-query reactive state.
 */
export type QueryStateKey = 'data' | 'error' | 'isFetching' | 'isPending';

type QueryDataPending = {
  isPending: true;
  data: undefined;
};

type QueryDataSuccess<TData> = {
  isPending: false;
  data: TData;
};

/**
 *  The query data lifecycle state (pending | success).
 */
export type QueryDataState<TData> = QueryDataPending | QueryDataSuccess<TData>;

/**
 * Metadata passed to query functions or used to identify
 * a query cache entry when using the query client.
 * Either `queryKey` or `args` must be provided
 * to support query or lazy query variants.
 */
export type QueryMeta<TKey = unknown, TArgs = unknown> =
  | {
      queryKey: TKey;
      args?: TArgs;
    }
  | {
      queryKey?: TKey;
      args: TArgs;
    };

/**
 * Function signature for eager (non-lazy) query fetchers. `args` is `undefined`
 * because eager queries are called with the `queryKey` only.
 */
export type QueryFn<TData, TKey = unknown> = (options: {
  queryKey: TKey;
  args: undefined;
}) => TData | Promise<TData>;

/**
 * Function signature for lazy query fetchers. `queryKey` may be present or
 * undefined; `args` carries the trigger arguments.
 */
export type LazyQueryFn<TData, TArgs = unknown, TKey = unknown> = (options: {
  queryKey: TKey | undefined;
  args: TArgs;
}) => TData | Promise<TData>;

/**
 * Cache-level fetcher signature that receives the full `QueryMeta` object.
 */
export type CacheQueryFn<TData, TKey = unknown, TArgs = unknown> = (
  queryMeta: QueryMeta<TKey, TArgs>
) => TData | Promise<TData>;

/**
 * Result returned by fetch/refetch functions.
 */
export type FetchResult<TData> = {
  data?: TData;
  error?: Error;
};

/**
 * A function that triggers a refetch and returns a `FetchResult` promise.
 */
export type Refetch<TData> = () => Promise<FetchResult<TData>>;

/**
 * Trigger function used by lazy queries and mutations.
 */
export type QueryTrigger<TData, TArgs> = (args: TArgs) => Promise<FetchResult<TData>>;

export type BaseQueryHookOptions = {
  /**
   * Controls caching behavior for the hook.
   * - `auto`: can be reclaimed by the JS enginge when the query is not referenced by any component
   * - `persist`: keep query cache entries across the query client's lifecycle
   * - `off`: do not use the shared cache, also disable request deduplication
   * @default 'auto'
   */
  cacheMode?: 'auto' | 'persist' | 'off';
};

/**
 * Options for the eager `useQuery` hook.
 */
export type QueryHookOptions<TData, TKey> = BaseQueryHookOptions & {
  /**
   * Identifier for the query. Used to lookup or create cache entries.
   */
  queryKey: TKey;

  /**
   * Optional fetcher for the query. If omitted, the hook can still return reactive
   * query state for rendering.
   */
  queryFn?: QueryFn<TData, TKey>;

  /**
   * When `false`, automatic (declarative) fetching is disabled.
   * @default true
   */
  enabled?: boolean;

  /**
   * Time in milliseconds after a successful fetch during which the cached
   * data is considered fresh. This only applies to the current query hook.
   */
  staleTime?: number;
};

/**
 * Options for lazy query hooks and mutations. `queryFn` follows the
 * `LazyQueryFn` signature and `queryKey` is optional.
 */
export type LazyQueryHookOptions<TData, TArgs, TKey> = BaseQueryHookOptions & {
  /**
   * Optional query key for the lazy query. If provided, it is used with `args` for cache
   * identity; otherwise only `args` will be used for cache identity.
   */
  queryKey?: TKey;

  /**
   * Fetcher called when the returned `trigger` is invoked. Receives an object
   * with `queryKey` (if provided) and `args` supplied by the caller from `trigger`.
   */
  queryFn: LazyQueryFn<TData, TArgs, TKey>;
};

/**
 * Mutation options reuse lazy query options with `cacheMode` always disabled.
 */
export type MutationHookOptions<TData, TArgs, TKey> = Omit<
  LazyQueryHookOptions<TData, TArgs, TKey>,
  'cacheMode'
>;

/**
 * Options that can be defaulted by the client.
 */
export type DefaultableOptions = Pick<
  QueryHookOptions<unknown, unknown>,
  'cacheMode' | 'staleTime'
>;

/**
 * Metadata passed to middleware when per-query state get updated.
 */
export type MiddlewareMeta<TKey = unknown, TArgs = unknown> = QueryMeta<TKey, TArgs> & {
  stateKey: QueryStateKey;
};

/**
 * Middleware signature for the state builder used by the query client.
 */
export interface QueryStateMiddleware {
  <TValue>(state: State<TValue>, meta: MiddlewareMeta): Setter<TValue>;
}

/**
 * Observer options for receiving query state update callbacks from hooks.
 */
export type QueryObserverOptions<TData> = {
  onData?: (data: TData) => void;
  onError?: (error: Error) => void;
};

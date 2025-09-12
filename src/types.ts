import type { State, Setter } from 'reactish-state';

/**
 * Keys for reactive per-query state.
 */
export type QueryStateKey = 'data' | 'error' | 'isFetching' | 'isPending';

/**
 * Represents query data that is currently pending.
 * `isPending` is `true` and `data` is `undefined`.
 */
type QueryDataPending = {
  isPending: true;
  data: undefined;
};

/**
 * Represents query data that has successfully loaded.
 * `isPending` is `false` and `data` contains the fetched value.
 */
type QueryDataSuccess<TData> = {
  isPending: false;
  data: TData;
};

/**
 * The lifecycle state of query data (`pending` | `success`).
 */
export type QueryDataState<TData> = QueryDataPending | QueryDataSuccess<TData>;

/**
 * Metadata passed to query functions or used to identify
 * a query cache entry when using the query client.
 *
 * Either `queryKey` or `args` must be provided
 * to support declarative or lazy query variants.
 */
export type QueryMeta<TKey = unknown, TArgs = unknown> =
  | { queryKey: TKey; args?: TArgs }
  | { queryKey?: TKey; args: TArgs };

/**
 * Function signature for declarative (automatic/reactive) query fetchers.
 * `args` is `undefined` because declarative queries are called with `queryKey` only.
 *
 * @returns The fetched data or a promise that resolves to it.
 */
export type QueryFn<TData, TKey = unknown> = (options: {
  queryKey: TKey;
  args: undefined;
}) => TData | Promise<TData>;

/**
 * Function signature for lazy query fetchers.
 * `queryKey` may be present or undefined; `args` carries the trigger arguments.
 *
 * @returns The fetched data or a promise that resolves to it.
 */
export type LazyQueryFn<TData, TArgs = unknown, TKey = unknown> = (options: {
  queryKey: TKey | undefined;
  args: TArgs;
}) => TData | Promise<TData>;

/**
 * Cache-level fetcher signature that receives the full `QueryMeta` object.
 *
 * @returns The fetched data or a promise that resolves to it.
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

/**
 * Base options for query hooks.
 */
export type BaseQueryHookOptions = {
  /**
   * Controls caching behavior for the hook.
   * - `auto`: can be reclaimed by the JS engine when the query is not referenced by any component
   * - `persist`: keeps query cache entries across the query client's lifecycle
   * - `off`: does not use the shared cache and disables request deduplication
   * @default 'auto'
   */
  cacheMode?: 'auto' | 'persist' | 'off';
};

/**
 * Options for the declarative `useQuery` hook.
 */
export type QueryHookOptions<TData, TKey> = BaseQueryHookOptions & {
  /**
   * Identifier for the query. Used to look up or create cache entries.
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
 * Options for lazy query hooks.
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
 * Metadata passed to middleware when per-query state is updated.
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

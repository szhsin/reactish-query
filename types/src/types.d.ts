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
export type QueryMeta<TKey = unknown, TArgs = unknown> = {
    queryKey: TKey;
    args?: TArgs;
} | {
    queryKey?: TKey;
    args: TArgs;
};
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
export type CacheQueryFn<TData, TKey = unknown, TArgs = unknown> = (queryMeta: QueryMeta<TKey, TArgs>) => TData | Promise<TData>;
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
     *
     * - `auto`: when a query is not referenced by any component, it becomes weakly held in the cache and the JS engine can reclaim it
     * - `persist`: keeps the query strongly held in the cache even if no component is referencing it
     * - `off`: disables the shared cache and request deduplication for this hook
     *
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
     * Can be anything that is serializable.
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
     * Time in milliseconds after a successful fetch during which cached data is considered
     * fresh for this hook instance.
     * Can be configured for infrequently changing data to avoid refetches.
     * @default 0
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
     * Can be anything that is serializable.
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
export type MutationHookOptions<TData, TArgs, TKey> = Omit<LazyQueryHookOptions<TData, TArgs, TKey>, 'cacheMode'>;
/**
 * Options that can be defaulted by the client.
 */
export type DefaultableOptions = Pick<QueryHookOptions<unknown, unknown>, 'cacheMode' | 'staleTime'>;
/**
 * Metadata passed to middleware when per-query state is updated.
 */
export type MiddlewareMeta<TKey = unknown, TArgs = unknown> = QueryMeta<TKey, TArgs> & {
    stateKey: QueryStateKey;
};
/**
 * Metadata provided to `useQueryObserver` callback events.
 */
export type ObserverMeta<TKey, TArgs = never> = [TArgs] extends [never] ? {
    queryKey: TKey;
} : {
    queryKey?: TKey;
    args: TArgs;
};
/**
 * Observer options for receiving query state update callbacks from hooks.
 */
export type QueryObserverOptions<TData, TKey = unknown, TArgs = never> = {
    /**
     * Called when data is available on mount, or when the data changes later on.
     */
    onData?: (data: TData, metadata: ObserverMeta<TKey, TArgs>) => void;
    /**
     * Called when there is an error on mount, or if another error occurs later on.
     */
    onError?: (error: Error, metadata: ObserverMeta<TKey, TArgs>) => void;
};
export {};

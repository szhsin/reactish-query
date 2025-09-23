import type { QueryHookOptions } from './types';
/**
 * Low-level query hook for building custom abstractions.
 *
 * Exposes observable slices of query state so consumers can compose their own
 * hooks. Pair with helpers from `useObservable.ts` (e.g. `useData`, `useError`,
 * `useIsFetching`) to select specific slices.
 *
 * Enables fine-grained reactivity: combining a `$` hook with a single helper
 * subscribes only to that slice. For example,
 * `useData(useQuery$(options))` rerenders only when `data` changes (not when
 * `isFetching` or `error` updates).
 *
 * @returns An object containing:
 *  - `refetch` — function to refetch the query
 *
 * @example
 * const { data, refetch } = useData(useQuery$({ queryKey: 'todos', queryFn }));
 * const { data, error, refetch } = useData(useError(useQuery$({ queryKey: 'todos', queryFn })));
 * // or make it reusable
 * const useQueryData = <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) =>
 *   useData(useQuery$(options));
 */
declare const useQuery$: <TData, TKey = unknown>(options: QueryHookOptions<TData, TKey>) => {
    /** Function to manually refetch the query */
    refetch: () => Promise<import("./types").FetchResult<TData>>;
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
        s: import("./types-internal").CacheEntryImmutable<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
        f: (args: unknown, declarative: boolean) => Promise<import("./types").FetchResult<TData>> | undefined;
    };
};
export { useQuery$ };

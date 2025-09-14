import type { QueryTrigger, LazyQueryHookOptions } from './types';
/**
 * Low-level lazy-query hook for building custom abstractions.
 *
 * Exposes observable slices of query state and a `trigger` function for running
 * the query on demand. Pair with helpers from `useObservable.ts` (e.g. `useData`,
 * `useError`, `useIsFetching`) to select specific slices.
 *
 * Enables fine-grained reactivity: combining with a single helper subscribes
 * only to that slice. For example,
 * `useData(useLazyQuery$(options))` rerenders only when `data` changes (not when
 * `isFetching` or `error` updates).
 *
 * @returns An object containing:
 *  - `trigger` — function to manually execute the query
 *  - `args` — last arguments passed to `trigger`
 *
 * @example
 * const { data, trigger } = useData(useLazyQuery$({ queryFn }));
 * const { data, error, trigger } = useData(useError(useLazyQuery$({ queryFn })));
 * // or make it reusable
 * const useDataAndTrigger = <TData, TArgs, TKey = unknown>(
 *   options: LazyQueryHookOptions<TData, TArgs, TKey>
 * ) => useData(useLazyQuery$(options));
 */
declare const useLazyQuery$: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TArgs, TKey>) => {
    /** @internal [INTERNAL ONLY – DO NOT USE] */
    _: {
        s: import("./types-internal").CacheEntryState<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
    };
    args: TArgs | undefined;
    trigger: QueryTrigger<TData, TArgs>;
};
export { useLazyQuery$ };

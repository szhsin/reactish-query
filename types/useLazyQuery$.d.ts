import type { QueryTrigger, LazyQueryHookOptions } from './types';
/**
 * Low-level, composable lazy-query hook.
 *
 * Purpose: provide observable slices (and a `trigger`) for lazy queries so
 * consumers can compose custom hooks. Use with helpers from `useObservable.ts`.
 *
 * Enable fine-grained reactivity: composing with a single helper subscribes only to
 * that slice. Example: `useData(useLazyQuery$(opts))` rerenders only when
 * `data` changes.
 *
 * @example
 *  const useDataAndTrigger = <TData, TArgs, TKey = unknown>(
 *    options: LazyQueryHookOptions<TData, TArgs, TKey>
 *  ) => useData(useLazyQuery$(options));
 */
declare const useLazyQuery$: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TArgs, TKey>) => {
    trigger: QueryTrigger<TData, TArgs>;
    _: {
        s: import("./types-internal").CacheEntryState<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
    };
};
export { useLazyQuery$ };

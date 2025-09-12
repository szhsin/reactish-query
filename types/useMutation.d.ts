import type { MutationHookOptions } from './types';
/**
 * Hook for mutations. Internally implemented as a lazy query with cache
 * disabled. Returns the same API as `useLazyQuery` (trigger + render-ready state).
 *
 * @returns An object containing:
 *  - `trigger` — function to manually execute the mutation
 *  - `data` — current mutation result
 *  - `error` — current mutation error
 *  - `isFetching` — whether the mutation is in progress
 *  - `isPending` — whether the mutation is pending
 */
declare const useMutation: <TData, TArgs, TKey = unknown>(options: MutationHookOptions<TData, TArgs, TKey>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    _: {
        s: import("./types-internal").CacheEntryState<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
    };
} & ({
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>));
export { useMutation };

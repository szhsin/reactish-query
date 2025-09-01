import type { LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TArgs>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    _: {
        s: import("./types-internal").CacheEntryState<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
    };
} & {
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>);
export { useLazyQuery };

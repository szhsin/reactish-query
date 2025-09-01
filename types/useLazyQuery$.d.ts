import type { QueryTrigger, LazyQueryHookOptions } from './types';
declare const useLazyQuery$: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TArgs>) => {
    trigger: QueryTrigger<TData, TArgs>;
    _: {
        s: import("./types-internal").CacheEntryState<TData>;
        $: import("reactish-state").State<import("./types-internal").QueryCacheEntry<TData>, unknown>;
    };
};
export { useLazyQuery$ };

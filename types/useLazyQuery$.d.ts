import type { QueryTrigger, LazyQueryHookOptions } from './types';
declare const useLazyQuery$: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TArgs>) => {
    trigger: QueryTrigger<TData, TArgs>;
    _: import("./types-internal").CacheEntryState<TData>;
};
export { useLazyQuery$ };

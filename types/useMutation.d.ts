import type { MutationHookOptions } from './types';
declare const useMutation: <TData, TArgs, TKey = unknown>(options: MutationHookOptions<TData, TKey, TArgs>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    _: import("./types-internal").CacheEntryState<TData>;
} & ({
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>));
export { useMutation };

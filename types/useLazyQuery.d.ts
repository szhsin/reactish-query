import type { LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TArgs>) => {
    trigger: import("./types").QueryTrigger<TData, TArgs>;
    _: import("./types-internal").InternalHookApi<TData>;
} & {
    isFetching: boolean;
} & ({
    error: Error | undefined;
} & import("./types").QueryDataState<TData>);
export { useLazyQuery };

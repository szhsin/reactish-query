import type { QueryTrigger, LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TArgs>) => {
    trigger: QueryTrigger<TData, TArgs>;
    isPending: true;
    isFetching: boolean;
    data?: undefined;
    error?: undefined;
} | {
    trigger: QueryTrigger<TData, TArgs>;
    isPending: false;
    isFetching: boolean;
    data?: undefined;
    error: Error;
} | {
    trigger: QueryTrigger<TData, TArgs>;
    isPending: false;
    isFetching: boolean;
    data: TData;
    error?: undefined;
};
export { useLazyQuery };

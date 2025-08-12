import type { QueryTrigger, LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TArgs, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TArgs>) => readonly [QueryTrigger<TData, TArgs>, {
    isPending: true;
    isFetching: boolean;
    data?: undefined;
    error?: undefined;
} | {
    isPending: false;
    isFetching: boolean;
    data?: undefined;
    error: Error;
} | {
    isPending: false;
    isFetching: boolean;
    data: TData;
    error?: undefined;
}];
export { useLazyQuery };

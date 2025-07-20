import type { FetchTrigger, LazyQueryHookOptions } from './types';
declare const useLazyQuery: <TData, TParams, TKey = unknown>(options: LazyQueryHookOptions<TData, TKey, TParams>) => readonly [FetchTrigger<TData, TParams>, {
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
